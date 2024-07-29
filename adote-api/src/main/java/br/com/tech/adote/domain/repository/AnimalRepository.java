package br.com.tech.adote.domain.repository;

import br.com.tech.adote.domain.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    @Query("SELECT a FROM Animal a WHERE LOWER(a.nome) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Animal>  findByName(String name);
}
