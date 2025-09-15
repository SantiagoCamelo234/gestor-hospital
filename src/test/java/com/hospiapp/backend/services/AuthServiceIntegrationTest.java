package com.hospiapp.backend.services;

import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceIntegrationTest {

    private final UsuarioRepository repo = new UsuarioRepository();
    private final AuthService authService = new AuthService(repo);

    @Test
    void testRegistrarYLogin() {
        Usuario user = authService.registrar("admin", "123", Usuario.Rol.ADMIN, null);
        assertNotNull(user.getId());

        String token = authService.login("admin", "123");
        assertNotNull(token);

        Usuario validado = authService.validarToken(token);
        assertEquals("admin", validado.getUsername());
    }

    @Test
    void testLogout() {
        authService.registrar("user", "pass", Usuario.Rol.PACIENTE, null);
        String token = authService.login("user", "pass");
        authService.logout(token);
        assertThrows(RuntimeException.class, () -> authService.validarToken(token));
    }
}
