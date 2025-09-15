package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.repositories.MedicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MedicoService {

    private final MedicoRepository repository;

    public MedicoService(MedicoRepository repository) {
        this.repository = repository;
    }

    // Crear un médico
    public Medico crear(Medico medico) {
        if (medico.getId() == null || medico.getId().isEmpty()) {
            medico.setId(UUID.randomUUID().toString());
        }
        return repository.save(medico);
    }

    // Obtener un médico por ID
    public Optional<Medico> obtener(String id) {
        return repository.findById(id);
    }

    // Eliminar un médico
    public boolean eliminar(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public Medico actualizar(String id, Medico cambios) {
        Medico existente = repository.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        existente.setNombre(cambios.getNombre());
        existente.setApellido(cambios.getApellido());
        existente.setEspecialidad(cambios.getEspecialidad());
        existente.setTelefono(cambios.getTelefono());
        return repository.save(existente);
    }

    // Autocompletar por nombre o apellido
    public List<String> autocompletarNombre(String q) {
        return repository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(q, q)
                .stream()
                .map(medico -> medico.getNombre() + " " + medico.getApellido())
                .toList();
    }

    public List<Medico> filtrarPorEspecialidad(String especialidad) {
        return repository.findByEspecialidadIgnoreCase(especialidad);
    }

    public List<Medico> listar() {
        return repository.findAll();
    }
}
