package com.faculdade.reservasala.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservas")
@Schema(name = "Reserva", description = "Modelo de reserva de sala")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Column(nullable = false)
    @Schema(example = "1")
    private Long salaId;
    
    @Column(nullable = false)
    @Schema(example = "1")
    private Long usuarioId;
    
    @Column(nullable = false)
    @Schema(example = "2024-04-08T14:00:00")
    private LocalDateTime dataHoraInicio;
    
    @Column(nullable = false)
    @Schema(example = "2024-04-08T15:00:00")
    private LocalDateTime dataHoraFim;
    
    @Column(nullable = false)
    @Schema(example = "Reunião de projeto")
    private String motivo;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Schema(example = "PENDENTE")
    private StatusReserva status;
} 