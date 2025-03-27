
# Sistema de Reserva de Salas

Este repositório contém a implementação de um sistema acadêmico de **Reserva de Salas**, desenvolvido como parte de uma tarefa acadêmica. O objetivo principal do projeto é **desacoplar as entidades** envolvidas no sistema, criando uma estrutura modular e de fácil manutenção.

## Estrutura do Projeto

O repositório está dividido em três projetos principais:

1. **Reserva**: Gerencia as reservas realizadas pelos usuários, contendo informações sobre o agendamento e as salas reservadas.
2. **Usuário**: Responsável pela gestão de usuários, permitindo que eles façam reservas. Contém dados como login, permissões e outros detalhes.
3. **Sala**: Gerencia as salas disponíveis para reserva, incluindo informações sobre capacidade, localização e disponibilidade.

Cada uma dessas entidades está separada em módulos distintos para garantir o desacoplamento e a modularidade do sistema.

## Tecnologias Utilizadas

- **Spring Boot**: Framework principal utilizado para o desenvolvimento do sistema, que facilita a criação de APIs RESTful e a integração entre os serviços.
- **Spring Data JPA**: Biblioteca utilizada para gerenciamento de dados e persistência no banco de dados relacional.
- **PostgreSQL**: Banco de dados utilizado para armazenar as informações sobre usuários, reservas e salas.
- **Lombok**: Biblioteca para reduzir o código boilerplate, como getters, setters e outros métodos auxiliares.

## Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
