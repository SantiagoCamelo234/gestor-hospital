package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import com.hospiapp.backend.repositories.UsuarioRepository;
import com.hospiapp.backend.services.ActionHistoryService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final ActionHistoryService historyService;
    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    public SystemController(ActionHistoryService historyService,
                           UsuarioRepository usuarioRepository,
                           MedicoRepository medicoRepository,
                           PacienteRepository pacienteRepository,
                           PasswordEncoder passwordEncoder) {
        this.historyService = historyService;
        this.usuarioRepository = usuarioRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/undo")
    public String undo() {
        return historyService.undo();
    }

    @GetMapping("/actions")
    public List<String> actions() {
        return historyService.history();
    }

    @PostMapping("/init-data")
    public String initData() {
        try {
            // Create admin user
            Usuario admin = new Usuario();
            admin.setId(UUID.randomUUID().toString());
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            usuarioRepository.save(admin);

            // Create doctor user
            Usuario doctor = new Usuario();
            doctor.setId(UUID.randomUUID().toString());
            doctor.setUsername("doctor");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRol(Usuario.Rol.MEDICO);
            usuarioRepository.save(doctor);

            // Create doctor entity
            Medico medico = new Medico();
            medico.setId(doctor.getId());
            medicoRepository.save(medico);

            // Create patient user
            Usuario patient = new Usuario();
            patient.setId(UUID.randomUUID().toString());
            patient.setUsername("patient");
            patient.setPassword(passwordEncoder.encode("patient123"));
            patient.setRol(Usuario.Rol.PACIENTE);
            usuarioRepository.save(patient);

            // Create patient entity
            Paciente paciente = new Paciente();
            paciente.setId(patient.getId());
            pacienteRepository.save(paciente);

            return "Initial data created successfully! Users: admin/admin123, doctor/doctor123, patient/patient123";
        } catch (Exception e) {
            return "Error creating initial data: " + e.getMessage();
        }
    }
}






