package com.hospiapp.backend.utils;

import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.services.AuthService;

import java.util.Arrays;

public class AuthHelper {

    private final AuthService authService;

    public AuthHelper(AuthService authService) {
        this.authService = authService;
    }

    public Usuario verificarToken(String token, Usuario.Rol... rolesPermitidos) {
        Usuario usuario = authService.validarToken(token);

        // Asignar asociadoId si es null y es PACIENTE
        if (usuario.getRol() == Usuario.Rol.PACIENTE && usuario.getAsociadoId() == null) {
            usuario.setAsociadoId(usuario.getId());
        }

        boolean permitido = Arrays.stream(rolesPermitidos).anyMatch(r -> r == usuario.getRol());
        if (!permitido) {
            throw new RuntimeException("No autorizado");
        }
        return usuario;
    }

}
