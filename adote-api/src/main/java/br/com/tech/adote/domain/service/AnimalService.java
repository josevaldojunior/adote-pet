package br.com.tech.adote.domain.service;

import br.com.tech.adote.api.assembler.AnimalAssembler;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.domain.enums.Status;
import br.com.tech.adote.domain.execption.NegocioException;
import br.com.tech.adote.domain.model.Animal;
import br.com.tech.adote.domain.repository.AnimalRepository;
import br.com.tech.adote.domain.util.AnimalUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AnimalAssembler animalAssembler;
    private final AnimalUtil animalUtil;

    @Transactional
    public AnimalModel createAnimal(Animal animal) {
        animalRepository.save(animal);
        return getIdadeAnimal(animal);
    }

    public List<AnimalModel> getAllAnimals() {
        return animalRepository.findAll()
                .stream()
                .map(this::getIdadeAnimal)
                .toList();
    }

    public AnimalModel getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal não encontrado"));

        return getIdadeAnimal(animal);
    }

    public List<AnimalModel> getAnimalsByName(String name) {
        if (!name.isEmpty()) {
            return animalRepository.findByName(name.trim())
                    .stream()
                    .map(this::getIdadeAnimal)
                    .toList();
        }
        return Collections.emptyList();
    }

    public Animal updateAnimalStatus(Long id, Status status) {
        Animal animal = animalRepository.findById(id).orElseThrow(() -> new NegocioException("Animal not found"));
        animal.setStatus(status);
        return animalRepository.save(animal);
    }

    public AnimalModel getIdadeAnimal(Animal animal) {
        AnimalModel animalModel = animalAssembler.toModel(animal);
        animalModel.setIdade(animalUtil.calcularIdade(animal.getDataNascimento()));

        return animalModel;
    }
}
