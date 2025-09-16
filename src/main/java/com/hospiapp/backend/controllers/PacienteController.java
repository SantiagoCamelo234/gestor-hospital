package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.paciente.Paciente;
import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.services.AuthService;
import com.hospiapp.backend.services.PacienteService;
import com.hospiapp.backend.utils.AuthHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService service;
    private final AuthHelper authHelper;

    // Estructuras en memoria
    private final com.hospiapp.backend.datastructures.CustomTrie trieNombres = new com.hospiapp.backend.datastructures.CustomTrie();
    private final com.hospiapp.backend.datastructures.CustomBST<String, Paciente> bstAlfabetico = new com.hospiapp.backend.datastructures.CustomBST<>();

    public PacienteController(PacienteService service, AuthService authService) {
        this.service = service;
        this.authHelper = new AuthHelper(authService);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Paciente paciente) {
        try {
            Paciente resultado = service.crear(paciente);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            throw new RuntimeException("Error al crear paciente: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam(value = "orden", required = false) String orden,
                                    @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                                    @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        try {
            List<Paciente> all = service.listar();
            if ("alfabetico".equalsIgnoreCase(orden)) {
                // construir BST por nombre completo
                for (Paciente p : all) {
                    String key = (p.getNombre() == null ? "" : p.getNombre()) + " " + (p.getApellido() == null ? "" : p.getApellido());
                    bstAlfabetico.insert(key.toLowerCase(), p);
                }
                List<Paciente> ordenados = bstAlfabetico.inOrder();
                int from = Math.max(0, page * size);
                int to = Math.min(ordenados.size(), from + size);
                if (from >= to) return ResponseEntity.ok(java.util.Collections.emptyList());
                return ResponseEntity.ok(ordenados.subList(from, to));
            }
            // sin ordenar, devolver paginado simple
            int from = Math.max(0, page * size);
            int to = Math.min(all.size(), from + size);
            if (from >= to) return ResponseEntity.ok(java.util.Collections.emptyList());
            return ResponseEntity.ok(all.subList(from, to));
        } catch (Exception e) {
            throw new RuntimeException("Error al listar pacientes: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable String id) {
        try {
            Paciente paciente = service.obtener(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
            return ResponseEntity.ok(paciente);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener paciente: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable String id,
                                        @RequestBody Paciente cambios) {
        try {
            Paciente resultado = service.actualizar(id, cambios);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar paciente: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        try {
            service.eliminar(id);
            return ResponseEntity.ok().body("Paciente eliminado correctamente");
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar paciente: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> buscarPorPrefijo(@RequestParam("nombre") String nombre) {
        try {
            // construir Trie on-demand con nombres actuales
            for (Paciente p : service.listar()) {
                String full = ((p.getNombre() == null ? "" : p.getNombre()) + " " + (p.getApellido() == null ? "" : p.getApellido())).trim();
                if (!full.isEmpty()) trieNombres.insert(full.toLowerCase());
            }
            java.util.List<String> resultados = trieNombres.startsWith(nombre.toLowerCase(), 10);
            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar pacientes: " + e.getMessage());
        }
    }
}
