package br.com.tech.adote.api.assembler;

import br.com.tech.adote.api.model.input.CategoriaInput;
import br.com.tech.adote.domain.model.Categoria;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class CategoriaAssembler {
    private final ModelMapper modelMapper;

    public Categoria toEntity(final CategoriaInput categoriaInput) {
        return modelMapper.map(categoriaInput, Categoria.class);
    }
}
