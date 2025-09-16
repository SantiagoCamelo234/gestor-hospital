package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PacienteServiceIntegrationTest {

    private final PacienteRepository repo = new PacienteRepository();
    private final PacienteService pacienteService = new PacienteService(repo);

    @Test
    void testCrearYListarPacientes() {
        Paciente paciente = new Paciente(null, "Juan", "Perez", "12345", "555-1234");
        Paciente guardado = pacienteService.crear(paciente);

        assertNotNull(guardado.getId());

        List<Paciente> pacientes = pacienteService.listar();
        assertEquals(1, pacientes.size());
        assertEquals("Juan", pacientes.get(0).getNombre());
    }
}
