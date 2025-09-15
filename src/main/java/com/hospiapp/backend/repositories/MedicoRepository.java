package com.hospiapp.backend.repositories;

import com.hospiapp.backend.domain.medico.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, String> {
    List<Medico> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);
    List<Medico> findByEspecialidadIgnoreCase(String especialidad);
}
