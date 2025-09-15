package com.hospiapp.backend.repositories;

import com.hospiapp.backend.domain.cita.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitaRepository extends JpaRepository<Cita, String> {

    // Devuelve la primera cita de un médico ordenada por fecha ascendente
    Optional<Cita> findFirstByMedicoIdOrderByFechaAsc(String medicoId);

    // Opcional: listar todas las citas de un médico
    List<Cita> findAllByMedicoId(String medicoId);

    // Opcional: listar todas las citas de un paciente
    List<Cita> findAllByPacienteId(String pacienteId);
}
