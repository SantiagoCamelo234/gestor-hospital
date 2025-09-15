package com.hospiapp.backend.domain.consulta;

import com.hospiapp.backend.domain.medico.Medico;
import com.hospiapp.backend.domain.paciente.Paciente;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "consultas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaMedica {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "medico_id")
    private Medico medico;

    private String fecha;
    private String diagnostico;
    private String tratamiento;
}
