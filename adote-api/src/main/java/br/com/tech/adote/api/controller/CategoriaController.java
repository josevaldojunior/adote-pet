package br.com.tech.adote.api.controller;

import br.com.tech.adote.api.assembler.CategoriaAssembler;
import br.com.tech.adote.api.model.input.CategoriaInput;
import br.com.tech.adote.domain.model.Categoria;
import br.com.tech.adote.domain.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Categorias")
@AllArgsConstructor
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final CategoriaAssembler categoriaAssembler;

    @Operation(summary = "Cria uma nova categoria")
    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody CategoriaInput categoriaInput) {
        return new ResponseEntity<>(categoriaService.createCategoria(categoriaAssembler.toEntity(categoriaInput)), HttpStatus.CREATED);
    }

    @Operation(summary = "Lista todas as categorias")
    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        return new ResponseEntity<>(categoriaService.getAllCategorias(), HttpStatus.OK);
    }

    @Operation(summary = "Altera uma categorias")
    @PutMapping("/alterar/{id}/{nome}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Long id, @Valid @PathVariable String nome) {
        Categoria categoriaAtualizada = categoriaService.updateCategoria(id, nome.trim());

        return ResponseEntity.ok(categoriaAtualizada);
    }
}
