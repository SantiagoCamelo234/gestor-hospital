package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.services.AuthService;
import com.hospiapp.backend.services.MedicoService;
import com.hospiapp.backend.utils.AuthHelper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    private final MedicoService service;
    private final AuthHelper authHelper;

    public MedicoController(MedicoService service, AuthService authService) {
        this.service = service;
        this.authHelper = new AuthHelper(authService);
    }

    @PostMapping
    public Medico crear(@RequestHeader("Authorization") String token,
                        @RequestBody Medico medico) {
        authHelper.verificarToken(token, Usuario.Rol.ADMIN);
        return service.crear(medico);
    }

    @GetMapping("/{id}")
    public Medico obtener(@RequestHeader("Authorization") String token,
                          @PathVariable String id) {
        authHelper.verificarToken(token, Usuario.Rol.ADMIN);
        return service.obtener(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
    }

    @PutMapping("/{id}")
    public Medico actualizar(@RequestHeader("Authorization") String token,
                             @PathVariable String id,
                             @RequestBody Medico cambios) {
        authHelper.verificarToken(token, Usuario.Rol.ADMIN);
        return service.actualizar(id, cambios);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@RequestHeader("Authorization") String token,
                         @PathVariable String id) {
        authHelper.verificarToken(token, Usuario.Rol.ADMIN);
        if (!service.eliminar(id)) throw new RuntimeException("Médico no encontrado");
    }

    @GetMapping
    public List<Medico> listar(@RequestHeader("Authorization") String token,
                               @RequestParam(value = "especialidad", required = false) String especialidad) {
        authHelper.verificarToken(token, Usuario.Rol.ADMIN);
        if (especialidad != null && !especialidad.isBlank()) {
            return service.filtrarPorEspecialidad(especialidad);
        }
        return service.listar();
    }
}
