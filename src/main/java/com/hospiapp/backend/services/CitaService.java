package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.cita.Cita;
import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.repositories.CitaRepository;
import com.hospiapp.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CitaService {

    private final CitaRepository citaRepo;
    private final UsuarioRepository usuarioRepo;

    public CitaService(CitaRepository citaRepo, UsuarioRepository usuarioRepo) {
        this.citaRepo = citaRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public Cita agendarCita(String pacienteId, String medicoId, String fecha, Cita.Prioridad prioridad) {
        Usuario paciente = usuarioRepo.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        if (paciente.getRol() != Usuario.Rol.PACIENTE) throw new RuntimeException("ID no corresponde a un paciente");

        Usuario medico = usuarioRepo.findById(medicoId)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        if (medico.getRol() != Usuario.Rol.MEDICO) throw new RuntimeException("ID no corresponde a un médico");

        Cita cita = new Cita(UUID.randomUUID().toString(), paciente, medico, fecha, prioridad);
        return citaRepo.save(cita);
    }

    public Cita atenderCita(String medicoId) {
        // Busca la primera cita del médico pendiente
        return citaRepo.findFirstByMedicoIdOrderByFechaAsc(medicoId)
                .orElseThrow(() -> new RuntimeException("No hay citas para atender"));
    }

    public List<Cita> listarCitas() {
        return citaRepo.findAll();
    }
}
