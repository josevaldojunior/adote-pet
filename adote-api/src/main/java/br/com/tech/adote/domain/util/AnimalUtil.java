package br.com.tech.adote.domain.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
public class AnimalUtil {
    public String calcularIdade(LocalDate dataNascimento) {
        if (dataNascimento == null) {
            return "0 anos";
        }
        Period periodo = Period.between(dataNascimento, LocalDate.now());
        int anos = periodo.getYears();
        int meses = periodo.getMonths();

        if (anos == 0 && meses == 0) {
            return "Recém nascido";
        } else if (anos > 0 && meses > 0) {
            return anos + (anos == 1 ? " ano e " : " anos e ") + meses + (meses == 1 ? " mês" : " meses");
        } else if (anos > 0) {
            return anos + (anos == 1 ? " ano" : " anos");
        } else {
            return meses + (meses == 1 ? " mês" : " meses");
        }
    }
}
