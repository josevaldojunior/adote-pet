package br.com.tech.adote.api.model.input;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaIdInput {
    @NotNull
    private Long id;
}
