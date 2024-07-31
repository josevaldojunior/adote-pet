package br.com.tech.adote.api.controller;

import br.com.tech.adote.api.assembler.AnimalAssembler;
import br.com.tech.adote.api.model.AnimalModel;
import br.com.tech.adote.api.model.input.AnimalInput;
import br.com.tech.adote.domain.model.Animal;
import br.com.tech.adote.domain.service.AnimalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Animais")
@AllArgsConstructor
@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalService animalService;
    private final AnimalAssembler animalAssembler;

    @Operation(summary = "Cria registro do Animal", description = "Metodo que cria registro do Animal")
    @PostMapping
    public ResponseEntity<AnimalModel> createAnimal(@Valid @RequestBody AnimalInput animalInput) {
        Animal novoAnimal = animalAssembler.toEntity(animalInput);
        return new ResponseEntity<>(animalService.createAnimal(novoAnimal), HttpStatus.CREATED);
    }

    @Operation(summary = "Lista todos", description = "Metodo que retorna todos os animais")
    @GetMapping
    public ResponseEntity<List<AnimalModel>> getAllAnimals() {
        return new ResponseEntity<>(animalService.getAllAnimals(), HttpStatus.OK);
    }

    @Operation(summary = "Busca por ID", description = "Metodo que consulta o animal pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<AnimalModel> getAnimalById(@PathVariable Long id) {
        return animalService.getAnimalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Busca por Nome", description = "Metodo que consulta o animal pelo Nome")
    @GetMapping("/name")
    public ResponseEntity<List<AnimalModel>> getAnimalByName(@RequestParam String name) {
        return ResponseEntity.ok(animalService.getAnimalsByName(name));
    }

    @Operation(summary = "Altera Status", description = "Metodo que altera o status do animal")
    @PatchMapping("/status/{id}")
    public ResponseEntity<Animal> updateAnimalStatus(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.updateAnimalStatus(id));
    }

}
