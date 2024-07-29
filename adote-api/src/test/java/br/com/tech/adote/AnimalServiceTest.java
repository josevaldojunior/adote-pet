package br.com.tech.adote;

import br.com.tech.adote.api.assembler.AnimalAssembler;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.domain.enums.Status;
import br.com.tech.adote.domain.execption.NegocioException;
import br.com.tech.adote.domain.model.Animal;
import br.com.tech.adote.domain.repository.AnimalRepository;
import br.com.tech.adote.domain.service.AnimalService;
import br.com.tech.adote.domain.util.AnimalUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AnimalServiceTest {

    @InjectMocks
    private AnimalService animalService;

    @Mock
    private AnimalRepository animalRepository;

    @Mock
    private AnimalAssembler animalAssembler;

    @Mock
    private AnimalUtil animalUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAnimalById() {
        Animal animal = new Animal();
        animal.setId(1L);
        animal.setDataNascimento(LocalDate.of(2020, 1, 1));

        AnimalModel model = new AnimalModel();
        model.setId(animal.getId());

        when(animalRepository.findById(anyLong())).thenReturn(Optional.of(animal));
        when(animalAssembler.toModel(any(Animal.class))).thenReturn(model);

        AnimalModel animalModel = animalService.getAnimalById(1L);
        assertNotNull(animalModel);
        assertEquals(1L, animalModel.getId());
    }

    @Test
    void testGetAnimalByIdNotFound() {
        when(animalRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> animalService.getAnimalById(1L));

        String expectedMessage = "Animal não encontrado";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void testGetAnimalsByName() {
        Animal animal = new Animal();
        animal.setNome("Rex");
        animal.setDataNascimento(LocalDate.of(2020, 1, 1));

        AnimalModel model = new AnimalModel();
        model.setNome(animal.getNome());

        when(animalRepository.findByName(anyString())).thenReturn(List.of(animal));
        when(animalAssembler.toModel(any(Animal.class))).thenReturn(model);

        List<AnimalModel> animals = animalService.getAnimalsByName("Rex");
        assertNotNull(animals);
        assertEquals(1, animals.size());
        assertEquals("Rex", animals.get(0).getNome());
    }

    @Test
    void testGetAnimalsByNameEmpty() {
        List<AnimalModel> animals = animalService.getAnimalsByName("");
        assertNotNull(animals);
        assertTrue(animals.isEmpty());
    }


    @Test
    void testUpdateAnimalStatus() {
        Animal animal = new Animal();
        animal.setStatus(Status.DISPONIVEL);

        when(animalRepository.findById(anyLong())).thenReturn(Optional.of(animal));
        when(animalRepository.save(any(Animal.class))).thenReturn(animal);

        Animal updatedAnimal = animalService.updateAnimalStatus(1L, Status.ADOTADO);
        assertEquals(Status.ADOTADO, updatedAnimal.getStatus());
        verify(animalRepository, times(1)).save(animal);
    }

    @Test
    void testUpdateAnimalStatusNotFound() {
        when(animalRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(NegocioException.class, () -> animalService.updateAnimalStatus(1L, Status.ADOTADO));

        String expectedMessage = "Animal not found";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }
}
