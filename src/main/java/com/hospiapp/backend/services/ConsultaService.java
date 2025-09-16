package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.consulta.ConsultaMedica;
import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.repositories.ConsultaRepository;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ConsultaService {

    private final PacienteRepository pacienteRepo;
    private final MedicoRepository medicoRepo;
    private final ConsultaRepository consultaRepo;

    public ConsultaService(PacienteRepository pacienteRepo, MedicoRepository medicoRepo, ConsultaRepository consultaRepo) {
        this.pacienteRepo = pacienteRepo;
        this.medicoRepo = medicoRepo;
        this.consultaRepo = consultaRepo;
    }

    public ConsultaMedica agregarConsulta(String pacienteId, String medicoId, String fecha, String diagnostico, String tratamiento) {
        Paciente paciente = pacienteRepo.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Medico medico = medicoRepo.findById(medicoId)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        ConsultaMedica consulta = new ConsultaMedica(
                UUID.randomUUID().toString(),
                paciente, // ⚡ ahora pasamos el objeto Paciente
                medico,   // ⚡ objeto Medico
                fecha,
                diagnostico,
                tratamiento
        );

        // Guardamos en historial del paciente y persistimos consulta
        paciente.getHistorial().add(consulta);
        consultaRepo.save(consulta);
        pacienteRepo.save(paciente);

        return consulta;
    }


    public List<ConsultaMedica> obtenerHistorial(String pacienteId) {
        return consultaRepo.findByPacienteId(pacienteId);
    }

    public List<ConsultaMedica> listarTodas() {
        return consultaRepo.findAll();
    }
}
