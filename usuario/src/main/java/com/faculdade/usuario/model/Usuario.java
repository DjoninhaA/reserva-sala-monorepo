package com.faculdade.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "usuarios")
@Schema(name = "Usuario", description = "Modelo de usuário")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Column(nullable = false)
    @Schema(example = "João Silva")
    private String nome;
    
    @Column(nullable = false, unique = true)
    @Schema(example = "joao.silva@email.com")
    private String email;
    
    @Column(nullable = false)
    @Schema(example = "senha123")
    private String senha;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Schema(example = "ADMIN")
    private TipoUsuario tipo;
    
    @Column(nullable = false)
    @Schema(example = "true")
    private Boolean ativo;
} 