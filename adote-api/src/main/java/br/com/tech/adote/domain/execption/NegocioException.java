package br.com.tech.adote.domain.execption;

public class NegocioException extends RuntimeException {
    public NegocioException(String message) {
        super(message);
    }
}
