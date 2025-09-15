package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PacienteService {

    private final PacienteRepository repo;

    public PacienteService(PacienteRepository repo) {
        this.repo = repo;
    }

    public Paciente crear(Paciente paciente) {
        paciente.setId(UUID.randomUUID().toString());
        return repo.save(paciente);
    }

    public List<Paciente> listar() {
        return repo.findAll();
    }

    public Optional<Paciente> obtener(String id) {
        return repo.findById(id);
    }

    public Paciente actualizar(String id, Paciente cambios) {
        Paciente existente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        existente.setNombre(cambios.getNombre());
        existente.setApellido(cambios.getApellido());
        existente.setDocumento(cambios.getDocumento());
        existente.setTelefono(cambios.getTelefono());
        return repo.save(existente);
    }

    public void eliminar(String id) {
        if (!repo.existsById(id)) throw new RuntimeException("Paciente no encontrado");
        repo.deleteById(id);
    }
}
