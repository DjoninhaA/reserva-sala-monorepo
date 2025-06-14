package com.github.ms_reserva.infrastructure.rest;

import com.github.ms_reserva.application.ReservaService;
import com.github.ms_reserva.domain.model.Reserva;
import com.github.ms_reserva.infrastructure.rest.dto.ReservaRequestDTO;
import com.github.ms_reserva.infrastructure.rest.dto.ReservaResponseDTO;
import com.github.ms_reserva.infrastructure.rest.mapper.ReservaMapper;
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
@RequestMapping("/reservas")
@Tag(name = "Reservas", description = "API para gerenciamento de reservas de salas")
public class ReservaController {

    private final ReservaService reservaService;    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @Operation(
        summary = "Listar todas as reservas",
        description = "Retorna uma lista com todas as reservas cadastradas no sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de reservas retornada com sucesso",
                content = @Content(schema = @Schema(implementation = ReservaResponseDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listar() {
        List<ReservaResponseDTO> reservas = reservaService.listar()
                .stream()
                .map(ReservaMapper::toDTO)
                .toList();        return ResponseEntity.ok(reservas);
    }

    @Operation(
        summary = "Criar nova reserva",
        description = "Cria uma nova reserva no sistema com validação assíncrona de usuário via RabbitMQ"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva criada com sucesso",
                content = @Content(schema = @Schema(implementation = ReservaResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou reserva no passado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "409", description = "Conflito de horário na sala"),
        @ApiResponse(responseCode = "500", description = "Erro na validação assíncrona")
    })
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> salvar(
            @Parameter(description = "Dados da reserva a ser criada", required = true)
            @RequestBody ReservaRequestDTO reservaRequestDTO) {
        Reserva reserva = ReservaMapper.toEntity(reservaRequestDTO);
        Reserva saved = reservaService.salvar(reserva);        return ResponseEntity.ok(ReservaMapper.toDTO(saved));
    }

    @Operation(
        summary = "Buscar reserva por ID",
        description = "Busca uma reserva específica utilizando seu ID como identificador"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva encontrada com sucesso",
                content = @Content(schema = @Schema(implementation = ReservaResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "Reserva não encontrada"),
        @ApiResponse(responseCode = "400", description = "ID inválido")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> buscarPorId(
            @Parameter(description = "ID da reserva", required = true, example = "1")
            @PathVariable Long id) {
        return reservaService.buscarPorId(id)
                .map(ReservaMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}