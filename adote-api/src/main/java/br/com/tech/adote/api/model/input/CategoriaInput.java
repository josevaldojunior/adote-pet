package br.com.tech.adote.api.model.input;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaInput {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
}
