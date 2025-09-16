package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.cita.Cita;
import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CitaServiceIntegrationTest {

    private final PacienteRepository pacienteRepo = new PacienteRepository();
    private final MedicoRepository medicoRepo = new MedicoRepository();
    private final CitaService citaService = new CitaService(pacienteRepo, medicoRepo);

    @Test
    void testAgendarYAtenderCita() {
        Paciente paciente = new Paciente("1", "Juan", "Perez", "123", "555");
        Medico medico = new Medico("1", "Ana", "Lopez", "Cardio", "555");
        pacienteRepo.save(paciente);
        medicoRepo.save(medico);

        Cita cita = citaService.agendarCita("1", "1", "2025-09-10", Cita.Prioridad.NORMAL);
        assertNotNull(cita);

        Cita atendida = citaService.atenderCita();
        assertEquals(cita.getId(), atendida.getId());
    }
}
