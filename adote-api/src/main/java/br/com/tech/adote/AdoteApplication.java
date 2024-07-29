package br.com.tech.adote;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "Adote API", version = "1.0.0", description = "API de gestão de adoção de animais"))
@SpringBootApplication
public class AdoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdoteApplication.class, args);
	}

}
