package br.com.tech.adote.domain.service;

import br.com.tech.adote.api.assembler.AnimalAssembler;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.domain.enums.Status;
import br.com.tech.adote.domain.execption.NegocioException;
import br.com.tech.adote.domain.model.Animal;
import br.com.tech.adote.domain.model.Categoria;
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
    private final CategoriaService categoriaService;

    @Transactional
    public AnimalModel createAnimal(Animal animal) {
        animalRepository.save(animal);
        return getIdadeCategoriaAnimal(animal);
    }

    public List<AnimalModel> getAllAnimals() {
        return animalRepository.findAll()
                .stream()
                .map(this::getIdadeCategoriaAnimal)
                .toList();
    }

    public AnimalModel getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal não encontrado"));

        return getIdadeCategoriaAnimal(animal);
    }

    public List<AnimalModel> getAnimalsByName(String name) {
        if (!name.isEmpty()) {
            return animalRepository.findByName(name.trim())
                    .stream()
                    .map(this::getIdadeCategoriaAnimal)
                    .toList();
        }
        return Collections.emptyList();
    }

    @Transactional
    public Animal updateAnimalStatus(Long id) {
        Animal animal = animalRepository.findById(id).orElseThrow(() -> new NegocioException("Animal not found"));

        if (animal.getStatus() == Status.DISPONIVEL) {
            animal.setStatus(Status.ADOTADO);
        } else if (animal.getStatus() == Status.ADOTADO) {
            animal.setStatus(Status.DISPONIVEL);
        }

        return animalRepository.save(animal);
    }

    public AnimalModel getIdadeCategoriaAnimal(Animal animal) {
        AnimalModel animalModel = animalAssembler.toModel(animal);
        animalModel.setIdade(animalUtil.calcularIdade(animal.getDataNascimento()));

        Categoria categoria = categoriaService.getById(animal.getCategoria().getId());
        animalModel.setCategoria(categoria.getNome());

        return animalModel;
    }
}
