package com.github.ms_sala.infrastructure.rest;

import com.github.ms_sala.application.SalaService;
import com.github.ms_sala.domain.model.Sala;
import com.github.ms_sala.infrastructure.dto.SalaResponseDTO;
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
import java.util.Optional;

@RestController
@RequestMapping("/salas")
@Tag(name = "Salas", description = "API para gerenciamento de salas do sistema")
public class SalaController {

    private final SalaService salaService;    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @Operation(
        summary = "Criar nova sala",
        description = "Cria uma nova sala no sistema com nome e capacidade definidos"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sala criada com sucesso",
                content = @Content(schema = @Schema(implementation = SalaResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "409", description = "Sala com este nome já existe")
    })
    @PostMapping
    public ResponseEntity<SalaResponseDTO> criarSala(
            @Parameter(description = "Dados da sala a ser criada", required = true)
            @RequestBody Sala sala) {
        Sala novaSala = salaService.criarSala(sala);        return ResponseEntity.ok(toDTO(novaSala));
    }

    @Operation(
        summary = "Buscar sala por ID",
        description = "Busca uma sala específica utilizando seu ID como identificador"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sala encontrada com sucesso",
                content = @Content(schema = @Schema(implementation = SalaResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "Sala não encontrada"),
        @ApiResponse(responseCode = "400", description = "ID inválido")
    })
    @GetMapping("/{id}")
    public ResponseEntity<SalaResponseDTO> buscarPorId(
            @Parameter(description = "ID da sala", required = true, example = "1")
            @PathVariable Long id) {
        Optional<Sala> sala = salaService.buscarPorId(id);
        return sala.map(s -> ResponseEntity.ok(toDTO(s)))                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "Listar todas as salas",
        description = "Retorna uma lista com todas as salas cadastradas no sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de salas retornada com sucesso",
                content = @Content(schema = @Schema(implementation = SalaResponseDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public ResponseEntity<List<SalaResponseDTO>> listarTodas() {
        List<SalaResponseDTO> salasDTO = salaService.listarTodas()
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(salasDTO);
    }

    private SalaResponseDTO toDTO(Sala sala) {
        return new SalaResponseDTO(
                sala.getId(),
                sala.getNome().getNome(),
                sala.getCapacidade().getCapacidade()
        );
    }
}
