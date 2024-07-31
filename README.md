# Sistema de Adoção de Animais

Este é um sistema de adoção de animais desenvolvido com Spring Boot no back-end e React no front-end. Ele permite cadastrar, consultar e gerenciar animais e suas categorias.

## Tecnologias Utilizadas
- Back-end: Spring Boot
- Front-end: React
- Banco de Dados: MySQL
- Outras Ferramentas:
  - Lombok
  - Hibernate Validator
  - Axios
  - React Router
  - React Toastify

## Pré-requisitos
- Java 17
- Node.js
- MySQL

## Estrutura do Projeto
- prova-api/: Pasta contendo a API do projeto.
- prova-app/: Pasta contendo o aplicativo do projeto.
- Criando_Base_e_Tabelas.sql: Script SQL para criar o banco de dados, tabelas e popular tabelas.

## Passos para Configuração do Banco de Dados
1. Configurar a API
   - Altere o arquivo application.properties da API para configurar seu usuário e senha do MySQL
2. Executar Scripts SQL
  - Execute o script Criando_Base_e_Tabelas.sql para criar o banco de dados, tabelas e popular as tabelas

## Executar o Projeto
  ### Back-end:
  1. Clone o repositório:
     git clone <URL_DO_REPOSITORIO>
     cd adote/prova-api
  2. Compile e execute o back-end:
     ./mvnw spring-boot:run

  ### Front-end:
  1. Instale as dependências do Node.js:
     cd ../prova-app
     npm install
  2. Execute o front-end:
     npm start

## Acessando o Sistema
  - Back-end: O servidor Spring Boot estará rodando em http://localhost:8080
  - Documentação Swagger: A documentação está rodanndo em http://localhost:8080/swagger-ui/index.html
  - Front-end: A aplicação React estará rodando em http://localhost:3000

Notas Adicionais
  - Certifique-se de que o MySQL está rodando e acessível.
  - Verifique se as configurações de conexão com o banco de dados no arquivo application.properties estão corretas.
  - Em caso de dúvidas ou problemas, verifique os logs do back-end e front-end para identificar possíveis erros.
