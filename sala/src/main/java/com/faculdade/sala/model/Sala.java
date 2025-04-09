package com.faculdade.sala.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "salas")
@Schema(name = "Sala", description = "Modelo de sala")
public class Sala {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Column(nullable = false)
    @Schema(example = "Sala 101")
    private String nome;
    
    @Column(nullable = false)
    @Schema(example = "30")
    private Integer capacidade;
    
    @Column(nullable = false)
    @Schema(example = "Bloco A, 1º andar")
    private String localizacao;
    
    @Column(nullable = false)
    @Schema(example = "true")
    private Boolean disponivel;
} 