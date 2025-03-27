package com.faculdade.usuario.controller;  

import com.faculdade.usuario.Usuario;
import com.faculdade.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService service;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("usuarios", service.listar());
        return "usuarios";  
    }

    // Método para salvar um usuário
    @PostMapping("/salvar")
    public String salvar(@ModelAttribute Usuario usuario) {  
        service.salvar(usuario);
        return "redirect:/usuarios";  
    }
}
