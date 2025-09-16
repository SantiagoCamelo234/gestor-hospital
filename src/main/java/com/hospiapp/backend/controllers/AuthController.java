package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.dto.LoginDTO;
import com.hospiapp.backend.dto.RegistroRequest;
import com.hospiapp.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest request) {
        try {
            Usuario usuario = authService.registrar(request);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar usuario: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            String token = authService.login(loginDTO.getUsername(), loginDTO.getPassword());
            Usuario usuario = authService.findByUsername(loginDTO.getUsername());
            
            // Crear respuesta con token y datos del usuario
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", usuario.getId());
            response.put("username", usuario.getUsername());
            response.put("rol", usuario.getRol().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Error en el login: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            authService.logout(token);
            return ResponseEntity.ok().body("{\"message\": \"Logout exitoso\"}");
        } catch (Exception e) {
            throw new RuntimeException("Error en el logout: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token,
                                          @RequestParam(value = "username", required = false) String username) {
        try {
            Usuario usuario = authService.getCurrentUser(token, username);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("{\"error\": \"Usuario no autenticado\"}");
        }
    }

}

