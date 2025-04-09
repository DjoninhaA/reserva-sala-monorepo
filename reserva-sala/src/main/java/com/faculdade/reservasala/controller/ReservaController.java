package com.faculdade.reservasala.controller;

import com.faculdade.reservasala.model.Reserva;
import com.faculdade.reservasala.model.StatusReserva;
import com.faculdade.reservasala.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return reservaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Reserva> getReservasByUsuarioId(@PathVariable Long usuarioId) {
        return reservaService.findByUsuarioId(usuarioId);
    }

    @PostMapping
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
        try {
            Reserva savedReserva = reservaService.save(reserva);
            return ResponseEntity.ok(savedReserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Reserva> updateStatus(@PathVariable Long id, @RequestParam StatusReserva status) {
        Reserva updatedReserva = reservaService.updateStatus(id, status);
        return updatedReserva != null ? ResponseEntity.ok(updatedReserva) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        reservaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 