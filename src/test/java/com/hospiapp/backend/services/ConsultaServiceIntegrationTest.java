package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.consulta.ConsultaMedica;
import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ConsultaServiceIntegrationTest {

    private final PacienteRepository pacienteRepo = new PacienteRepository();
    private final MedicoRepository medicoRepo = new MedicoRepository();
    private final ConsultaService consultaService = new ConsultaService(pacienteRepo, medicoRepo);

    @Test
    void testAgregarYObtenerHistorial() {
        Paciente paciente = new Paciente("1", "Laura", "Martinez", "123", "555");
        Medico medico = new Medico("1", "Ana", "Lopez", "Cardio", "555");
        pacienteRepo.save(paciente);
        medicoRepo.save(medico);

        ConsultaMedica consulta = consultaService.agregarConsulta(
                "1",
                "1",
                "2025-09-10",
                "Diagnostico prueba",
                "Tratamiento prueba"
        );

        assertNotNull(consulta.getId());
        assertEquals("Diagnostico prueba", consulta.getDiagnostico());

        List<ConsultaMedica> historial = consultaService.obtenerHistorial("1");
        assertEquals(1, historial.size());
        assertEquals("Tratamiento prueba", historial.get(0).getTratamiento());
    }
}
