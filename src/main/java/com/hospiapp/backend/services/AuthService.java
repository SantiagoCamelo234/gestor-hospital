package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.dto.RegistroRequest;
import com.hospiapp.backend.repositories.MedicoRepository;
import com.hospiapp.backend.repositories.PacienteRepository;
import com.hospiapp.backend.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final Map<String, Usuario> sesiones = new HashMap<>(); // token -> usuario

    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepo,
                       UsuarioRepository usuarioRepository,
                       MedicoRepository medicoRepository,
                       PacienteRepository pacienteRepository,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.usuarioRepository = usuarioRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(RegistroRequest request) {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID().toString()); // 👈 conversión a String
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());

        usuarioRepository.save(usuario);

        switch (usuario.getRol()) {
            case MEDICO -> {
                Medico medico = new Medico();
                medico.setId(usuario.getId());
                medicoRepository.save(medico);
            }
            case PACIENTE -> {
                Paciente paciente = new Paciente();
                paciente.setId(usuario.getId());
                pacienteRepository.save(paciente);
            }
            case ADMIN -> {
                // Solo en usuarios
            }
        }

        return usuario;
    }

    public String login(String username, String password) {
        Usuario usuario = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        // Generar token simple
        String token = "Bearer " + UUID.randomUUID().toString();
        sesiones.put(token, usuario);
        return token;
    }

    public void logout(String token) {
        sesiones.remove(token);
    }

    public Usuario getCurrentUser(String token, String username) {
        if (token != null && token.startsWith("Bearer ")) {
            Usuario usuario = sesiones.get(token);
            if (usuario != null) {
                return usuario;
            }
        }
        
        if (username != null) {
            return usuarioRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        }
        
        throw new RuntimeException("Usuario no autenticado");
    }

    public Usuario findByUsername(String username) {
        return usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
