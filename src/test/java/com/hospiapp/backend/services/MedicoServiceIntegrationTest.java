package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.repositories.MedicoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MedicoServiceIntegrationTest {

    private final MedicoRepository repo = new MedicoRepository();
    private final MedicoService medicoService = new MedicoService(repo);

    @Test
    void testCrearYObtenerMedico() {
        Medico medico = medicoService.crear("Ana", "Lopez", "Cardio", "555-9876");
        assertNotNull(medico.getId());

        Optional<Medico> buscado = medicoService.obtener(medico.getId());
        assertTrue(buscado.isPresent());
        assertEquals("Ana", buscado.get().getNombre());
    }

    @Test
    void testEliminarMedico() {
        Medico medico = medicoService.crear("Carlos", "Perez", "Neurologia", "555-4321");
        boolean eliminado = medicoService.eliminar(medico.getId());
        assertTrue(eliminado);

        Optional<Medico> buscado = medicoService.obtener(medico.getId());
        assertFalse(buscado.isPresent());
    }
}
