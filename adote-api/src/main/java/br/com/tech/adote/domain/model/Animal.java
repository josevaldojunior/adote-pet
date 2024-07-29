package br.com.tech.adote.domain.model;

import br.com.tech.adote.domain.enums.Status;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String nome;
    private String descricao;
    private String urlImagem;
    private String categoria;
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    private Status status;

}
