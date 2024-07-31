package br.com.tech.adote;

import br.com.tech.adote.api.assembler.AnimalAssembler;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.domain.enums.Status;
import br.com.tech.adote.domain.execption.NegocioException;
import br.com.tech.adote.domain.model.Animal;
import br.com.tech.adote.domain.model.Categoria;
import br.com.tech.adote.domain.repository.AnimalRepository;
import br.com.tech.adote.domain.service.AnimalService;
import br.com.tech.adote.domain.service.CategoriaService;
import br.com.tech.adote.domain.util.AnimalUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnimalServiceTest {

    @Mock
    private AnimalRepository animalRepository;

    @Mock
    private AnimalAssembler animalAssembler;

    @Mock
    private AnimalUtil animalUtil;

    @Mock
    private CategoriaService categoriaService;

    @InjectMocks
    private AnimalService animalService;

    private Animal animal;
    private AnimalModel animalModel;
    private Categoria categoria;

    @BeforeEach
    void setUp() {
        animal = new Animal();
        animal.setId(1L);
        animal.setNome("Bobby");
        animal.setDataNascimento(LocalDate.of(2020, 1, 1));
        animal.setStatus(Status.DISPONIVEL);
        categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Dog");
        animal.setCategoria(categoria);

        animalModel = new AnimalModel();
        animalModel.setId(1L);
        animalModel.setNome("Bobby");
        animalModel.setIdade("3 anos e 6 meses"); // Atualize com o formato de idade como String
        animalModel.setCategoria("Dog");
    }

    @Test
    void testCreateAnimal() {
        when(animalRepository.save(any(Animal.class))).thenReturn(animal);
        when(animalAssembler.toModel(animal)).thenReturn(animalModel);
        when(animalUtil.calcularIdade(any(LocalDate.class))).thenReturn("3 anos e 6 meses");
        when(categoriaService.getById(any(Long.class))).thenReturn(categoria);

        AnimalModel createdAnimal = animalService.createAnimal(animal);

        assertNotNull(createdAnimal);
        assertEquals(animalModel.getNome(), createdAnimal.getNome());
        assertEquals(animalModel.getIdade(), createdAnimal.getIdade());
        verify(animalRepository, times(1)).save(animal);
    }

    @Test
    void testGetAllAnimals() {
        when(animalRepository.findAll()).thenReturn(List.of(animal));
        when(animalAssembler.toModel(animal)).thenReturn(animalModel);
        when(animalUtil.calcularIdade(any(LocalDate.class))).thenReturn("3 anos e 6 meses");
        when(categoriaService.getById(any(Long.class))).thenReturn(categoria);

        List<AnimalModel> animals = animalService.getAllAnimals();

        assertEquals(1, animals.size());
        assertEquals(animalModel.getIdade(), animals.get(0).getIdade());
        verify(animalRepository, times(1)).findAll();
    }

    @Test
    void testGetAnimalById() {
        when(animalRepository.findById(any(Long.class))).thenReturn(Optional.of(animal));
        when(animalAssembler.toModel(animal)).thenReturn(animalModel);
        when(animalUtil.calcularIdade(any(LocalDate.class))).thenReturn("3 anos e 6 meses");
        when(categoriaService.getById(any(Long.class))).thenReturn(categoria);

        Optional<AnimalModel> animalById = animalService.getAnimalById(1L);

        assertTrue(animalById.isPresent());
        assertEquals(animalModel.getNome(), animalById.get().getNome());
        assertEquals(animalModel.getIdade(), animalById.get().getIdade());
        verify(animalRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAnimalsByName() {
        when(animalRepository.findByName(any(String.class))).thenReturn(List.of(animal));
        when(animalAssembler.toModel(animal)).thenReturn(animalModel);
        when(animalUtil.calcularIdade(any(LocalDate.class))).thenReturn("3 anos e 6 meses");
        when(categoriaService.getById(any(Long.class))).thenReturn(categoria);

        List<AnimalModel> animals = animalService.getAnimalsByName("Bobby");

        assertEquals(1, animals.size());
        assertEquals(animalModel.getNome(), animals.get(0).getNome());
        assertEquals(animalModel.getIdade(), animals.get(0).getIdade());
        verify(animalRepository, times(1)).findByName("Bobby");
    }

    @Test
    void testUpdateAnimalStatus() {
        when(animalRepository.findById(any(Long.class))).thenReturn(Optional.of(animal));
        when(animalRepository.save(any(Animal.class))).thenReturn(animal);

        Animal updatedAnimal = animalService.updateAnimalStatus(1L);

        assertNotNull(updatedAnimal);
        assertEquals(Status.ADOTADO, updatedAnimal.getStatus());
        verify(animalRepository, times(1)).findById(1L);
        verify(animalRepository, times(1)).save(animal);
    }

    @Test
    void testUpdateAnimalStatus_NotFound() {
        when(animalRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        assertThrows(NegocioException.class, () -> animalService.updateAnimalStatus(1L));
        verify(animalRepository, times(1)).findById(1L);
    }
}
