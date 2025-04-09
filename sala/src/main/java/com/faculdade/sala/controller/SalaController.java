package com.faculdade.sala.controller;

import com.faculdade.sala.model.Sala;
import com.faculdade.sala.service.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @GetMapping
    public List<Sala> getAllSalas() {
        return salaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> getSalaById(@PathVariable Long id) {
        return salaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/disponiveis")
    public List<Sala> getSalasDisponiveis() {
        return salaService.findByDisponivel(true);
    }

    @PostMapping
    public Sala createSala(@RequestBody Sala sala) {
        return salaService.save(sala);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> updateSala(@PathVariable Long id, @RequestBody Sala sala) {
        Sala updatedSala = salaService.update(id, sala);
        return updatedSala != null ? ResponseEntity.ok(updatedSala) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/disponibilidade")
    public ResponseEntity<Sala> updateDisponibilidade(@PathVariable Long id, @RequestParam Boolean disponivel) {
        Sala updatedSala = salaService.updateDisponibilidade(id, disponivel);
        return updatedSala != null ? ResponseEntity.ok(updatedSala) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSala(@PathVariable Long id) {
        salaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 