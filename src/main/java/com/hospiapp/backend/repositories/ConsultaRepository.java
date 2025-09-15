package com.hospiapp.backend.repositories;

import com.hospiapp.backend.domain.consulta.ConsultaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<ConsultaMedica, String> {
    List<ConsultaMedica> findByPacienteId(String pacienteId);
}
