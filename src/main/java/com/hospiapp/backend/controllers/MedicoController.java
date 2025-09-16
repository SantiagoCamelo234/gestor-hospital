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
    public Medico crear(@RequestBody Medico medico) {
        return service.crear(medico);
    }

    @GetMapping("/{id}")
    public Medico obtener(@PathVariable String id) {
        return service.obtener(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
    }

    @PutMapping("/{id}")
    public Medico actualizar(@PathVariable String id,
                             @RequestBody Medico cambios) {
        return service.actualizar(id, cambios);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) {
        if (!service.eliminar(id)) throw new RuntimeException("Médico no encontrado");
    }

    @GetMapping
    public List<Medico> listar(@RequestParam(value = "especialidad", required = false) String especialidad) {
        if (especialidad != null && !especialidad.isBlank()) {
            return service.filtrarPorEspecialidad(especialidad);
        }
        return service.listar();
    }
}
