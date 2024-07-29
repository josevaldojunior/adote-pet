package br.com.tech.adote.api.model;

import br.com.tech.adote.domain.enums.Status;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AnimalModel {
    private Long id;
    private String nome;
    private String descricao;
    private String urlImagem;
    private String categoria;
    private LocalDate dataNascimento;
    private String idade;
    private Status status;
}
