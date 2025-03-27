package com.faculdade.usuario.service;

import com.faculdade.usuario.Usuario;
import com.faculdade.usuario.repository.UsuarioRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository repository;

    // Listar todos os usuários
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // Salvar um novo usuário
    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    // Buscar usuário por email
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }
}
