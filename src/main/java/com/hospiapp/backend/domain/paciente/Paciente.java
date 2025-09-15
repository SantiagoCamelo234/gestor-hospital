package com.hospiapp.backend.domain.paciente;

import com.hospiapp.backend.domain.consulta.ConsultaMedica;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    private String id;

    private String nombre;
    private String apellido;
    private String documento;
    private String telefono;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "paciente_id")
    private List<ConsultaMedica> historial = new ArrayList<>();
}
