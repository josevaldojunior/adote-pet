package br.com.tech.adote.domain.service;

import br.com.tech.adote.domain.execption.NegocioException;
import br.com.tech.adote.domain.model.Categoria;
import br.com.tech.adote.domain.repository.CategoriaRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional
    public Categoria createCategoria(Categoria categoria) {
        verificarNomeEmUso(categoria.getNome(), null);
        return categoriaRepository.save(categoria);
    }

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria getById(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    public Categoria updateCategoria(Long categoriaId, String name) {
        verificarNomeEmUso(name, categoriaId);
        Categoria categoria = getById(categoriaId);
        categoria.setNome(name);
        return categoriaRepository.save(categoria);
    }

    public void verificarNomeEmUso(String name, Long categoriaId) throws NegocioException {

        List<Categoria> categoriaExistentes = getAllCategorias();

        for (Categoria categoriaExistente : categoriaExistentes) {
            if (categoriaExistente.getId().equals(categoriaId)) {
                continue;
            }
            if (saoDescricoesSimilares(name.trim().toLowerCase(), categoriaExistente.getNome())) {
                throw new NegocioException("Já existe uma Categoria cadastrada com esse nome");
            }
        }
    }

    private boolean saoDescricoesSimilares(String name1, String name2) {

        String descricaoFormatada1 = name1.replaceAll("\\s+", "").toLowerCase();
        String descricaoFormatada2 = name2.replaceAll("\\s+", "").toLowerCase();

        return descricaoFormatada1.equals(descricaoFormatada2);
    }
}
