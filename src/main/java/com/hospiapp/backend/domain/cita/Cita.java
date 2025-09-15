package com.hospiapp.backend.domain.cita;

import com.hospiapp.backend.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "citas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cita implements Comparable<Cita> {

    public enum Prioridad { EMERGENCIA, NORMAL, URGENTE };

    @Id
    private String id;

    @ManyToOne
    private Usuario paciente;

    @ManyToOne
    private Usuario medico;

    private String fecha; // guardamos como String ISO 8601 para simplificar

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @Override
    public int compareTo(Cita other) {
        // Menor valor = mayor prioridad en min-heap: EMERGENCIA < URGENTE < NORMAL por orden ordinal
        int pr = Integer.compare(this.prioridad.ordinal(), other.prioridad.ordinal());
        if (pr != 0) return pr;
        // Si misma prioridad, ordenar por fecha (String ISO lexicográficamente funciona)
        return this.fecha.compareTo(other.fecha);
    }
}
