package br.com.tech.adote.api.assembler;

import br.com.tech.adote.api.model.input.AnimalInput;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.domain.model.Animal;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class AnimalAssembler {

    private final ModelMapper modelMapper;

    public Animal toEntity(final AnimalInput animalInput) {
        return modelMapper.map(animalInput, Animal.class);
    }

    public AnimalModel toModel(final Animal animal) {
        return modelMapper.map(animal, AnimalModel.class);
    }

}
