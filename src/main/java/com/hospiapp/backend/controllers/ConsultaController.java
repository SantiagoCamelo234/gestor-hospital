package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.consulta.ConsultaMedica;
import com.hospiapp.backend.services.ConsultaService;
import com.hospiapp.backend.datastructures.*;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    private final ConsultaService service;

    // Estructuras personalizadas
    private final CustomHashMap<String, ConsultaMedica> indexConsultas = new CustomHashMap<>();
    private final CustomTrie trieDiagnosticos = new CustomTrie();

    public ConsultaController(ConsultaService service) {
        this.service = service;
    }

    @PostMapping("/pacientes/{pacienteId}/consultas")
    public ConsultaMedica agregar(@PathVariable String pacienteId, @RequestBody ConsultaMedica consulta) {
        ConsultaMedica nueva = service.agregarConsulta(
                pacienteId,
                consulta.getMedico().getId(),
                consulta.getFecha(),
                consulta.getDiagnostico(),
                consulta.getTratamiento()
        );

        // Guardar en HashMap (para búsquedas rápidas)
        indexConsultas.put(nueva.getId(), nueva);

        // Insertar diagnóstico en Trie (para autocompletar)
        if (nueva.getDiagnostico() != null) {
            trieDiagnosticos.insert(nueva.getDiagnostico());
        }

        return nueva;
    }

    @GetMapping("/pacientes/{pacienteId}/consultas")
    public CustomDoublyLinkedList<ConsultaMedica> historial(@PathVariable String pacienteId) {
        List<ConsultaMedica> lista = service.obtenerHistorial(pacienteId);

        CustomDoublyLinkedList<ConsultaMedica> historial = new CustomDoublyLinkedList<>();
        for (ConsultaMedica c : lista) {
            historial.addLast(c);
        }
        return historial;
    }

    // Buscar consulta específica (HashMap)
    @GetMapping("/buscar/{id}")
    public ConsultaMedica buscarPorId(@PathVariable String id) {
        ConsultaMedica c = indexConsultas.get(id);
        if (c == null) {
            throw new RuntimeException("Consulta no encontrada con ID " + id);
        }
        return c;
    }

    // Autocompletar diagnósticos (Trie)
    @GetMapping("/diagnosticos")
    public List<String> autocompletarDiagnostico(@RequestParam String prefijo) {
        return trieDiagnosticos.startsWith(prefijo, 5);
    }

    // Listar todas las consultas
    @GetMapping
    public List<ConsultaMedica> listarTodas() {
        return service.listarTodas();
    }
}
