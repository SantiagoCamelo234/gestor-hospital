package com.hospiapp.backend.domain.medico;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medico {

    @Id
    private String id;

    private String nombre;
    private String apellido;
    private String especialidad;
    private String telefono;
}
