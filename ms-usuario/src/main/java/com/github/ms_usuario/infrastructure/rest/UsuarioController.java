package com.github.ms_usuario.infrastructure.rest;

import com.github.ms_usuario.application.UsuarioService;
import com.github.ms_usuario.domain.model.Usuario;
import com.github.ms_usuario.domain.model.value.*;
import com.github.ms_usuario.infrastructure.rest.dto.UsuarioRequestDTO;
import com.github.ms_usuario.infrastructure.rest.dto.UsuarioResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "API para gerenciamento de usuários do sistema")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }    @Operation(
        summary = "Criar novo usuário",
        description = "Cria um novo usuário no sistema com validação de CPF e email únicos"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário criado com sucesso",
                content = @Content(schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "409", description = "CPF ou email já existem no sistema")
    })
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(
            @Parameter(description = "Dados do usuário a ser criado", required = true)
            @RequestBody UsuarioRequestDTO userDTO) {
        Usuario usuario = new Usuario(
                new Nome(userDTO.nome()),
                new Email(userDTO.email()),
                new Cpf(userDTO.cpf()),
                new DataNascimento(userDTO.dataNascimento()),
                new Endereco(userDTO.endereco().getCidade(), userDTO.endereco().getEstado(), userDTO.endereco().getCep(), userDTO.endereco().getRua())
        );        return ResponseEntity.ok(usuarioService.criarUsuario(usuario));
    }

    @Operation(
        summary = "Listar todos os usuários",
        description = "Retorna uma lista com todos os usuários cadastrados no sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso",
                content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.buscarTodos();

        List<UsuarioResponseDTO> responseDTOs = usuarios.stream()
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNome().getNome(),
                        usuario.getEmail().getEmail(),
                        usuario.getCpf().getCpf(),
                        usuario.getDataNascimento().getDataNascimento(),
                        usuario.getEndereco()
                ))
                .toList();        return ResponseEntity.ok(responseDTOs);
    }

    @Operation(
        summary = "Buscar usuário por CPF",
        description = "Busca um usuário específico utilizando seu CPF como identificador"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário encontrado com sucesso",
                content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "400", description = "CPF inválido")
    })
    @GetMapping("/{cpf}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorCpf(
            @Parameter(description = "CPF do usuário (formato: 12345678901)", required = true, example = "12345678901")
            @PathVariable String cpf) {
        return usuarioService.buscarPorCpf(cpf)
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNome().getNome(),
                        usuario.getEmail().getEmail(),
                        usuario.getCpf().getCpf(),
                        usuario.getDataNascimento().getDataNascimento(),
                        usuario.getEndereco()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}