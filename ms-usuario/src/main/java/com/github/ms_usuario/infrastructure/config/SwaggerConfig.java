package com.github.ms_usuario.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI userServiceOpenAPI() {
        Server server1 = new Server();
        server1.setUrl("http://localhost:8080");
        server1.setDescription("Servidor Local - Desenvolvimento");

        Server server2 = new Server();
        server2.setUrl("http://localhost/api");
        server2.setDescription("Servidor via Nginx Gateway");

        Contact contact = new Contact()
                .email("admin@controlesa.com")
                .name("Equipe de Desenvolvimento")
                .url("https://github.com/LuizPagliari/controle-sala");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("API de Usuários - Sistema de Controle de Salas")
                .version("1.0.0")
                .contact(contact)
                .description("API REST para gerenciamento de usuários no sistema de controle de salas. " +
                           "Esta API é responsável por operações CRUD de usuários, validação de CPF, " +
                           "e validação assíncrona via RabbitMQ para outros microserviços.")
                .termsOfService("http://swagger.io/terms/")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(server1, server2));
    }
}
