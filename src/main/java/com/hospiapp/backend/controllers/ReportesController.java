package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.cita.Cita;
import com.hospiapp.backend.repositories.CitaRepository;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final CitaRepository citaRepository;

    public ReportesController(PacienteRepository pacienteRepository,
                              MedicoRepository medicoRepository,
                              CitaRepository citaRepository) {
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.citaRepository = citaRepository;
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> estadisticas() {
        Map<String, Object> r = new HashMap<>();
        r.put("numPacientes", pacienteRepository.count());
        r.put("numMedicos", medicoRepository.count());
        r.put("numCitas", citaRepository.count());
        return r;
    }

    // Placeholder simple: recomendaciones por especialidad más frecuente del paciente
    @GetMapping("/recomendaciones")
    public Map<String, Object> recomendaciones(@RequestParam("pacienteId") String pacienteId) {
        List<Cita> citas = citaRepository.findAllByPacienteId(pacienteId);
        String especialidadSugerida = citas.stream()
                .map(c -> c.getMedico().getUsername()) // no tenemos especialidad en Usuario; en un proyecto real se cruzaría con Medico
                .findFirst().orElse("general");
        Map<String, Object> r = new HashMap<>();
        r.put("pacienteId", pacienteId);
        r.put("sugerencia", especialidadSugerida);
        return r;
    }
}













