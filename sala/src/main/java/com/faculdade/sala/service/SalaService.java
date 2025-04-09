package com.faculdade.sala.service;

import com.faculdade.sala.model.Sala;
import com.faculdade.sala.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    public List<Sala> findAll() {
        return salaRepository.findAll();
    }

    public Optional<Sala> findById(Long id) {
        return salaRepository.findById(id);
    }

    public List<Sala> findByDisponivel(Boolean disponivel) {
        return salaRepository.findByDisponivel(disponivel);
    }

    public Sala save(Sala sala) {
        return salaRepository.save(sala);
    }

    public void deleteById(Long id) {
        salaRepository.deleteById(id);
    }

    public Sala update(Long id, Sala sala) {
        if (salaRepository.existsById(id)) {
            sala.setId(id);
            return salaRepository.save(sala);
        }
        return null;
    }

    public Sala updateDisponibilidade(Long id, Boolean disponivel) {
        Optional<Sala> salaOpt = salaRepository.findById(id);
        if (salaOpt.isPresent()) {
            Sala sala = salaOpt.get();
            sala.setDisponivel(disponivel);
            return salaRepository.save(sala);
        }
        return null;
    }
} 