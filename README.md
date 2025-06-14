# 🏢 Sistema de Controle de Salas

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message%20Broker-orange.svg)](https://www.rabbitmq.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

## 📑 Menu de Navegação

<details>
<summary>🧭 <strong>Índice Interativo</strong> (Clique para expandir)</summary>

### 📖 Informações Gerais
- [📋 Visão Geral](#-visão-geral)
- [✨ Principais Características](#-principais-características)
- [🔧 Microserviços](#-microserviços)
- [🔗 Componentes de Infraestrutura](#-componentes-de-infraestrutura)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)

### 🚀 Execução e Deploy
- [🚀 Como Executar](#-como-executar)
  - [📋 Pré-requisitos](#-pré-requisitos)
  - [⚡ Execução Rápida](#-execução-rápida)
- [🌐 Acessos do Sistema](#-acessos-do-sistema)
- [🔗 APIs dos Microserviços](#-apis-dos-microserviços)

### 📚 Documentação Técnica
- [📡 Padrão de Comunicação](#-padrão-de-comunicação)
- [🔄 Fluxo de Validação de Reservas](#-fluxo-de-validação-de-reservas)
- [📚 Documentação Swagger](#-documentação-swagger)
- [🗄️ Credenciais de Acesso](#️-credenciais-de-acesso)

### 🧪 Testes e Desenvolvimento
- [🧪 Testes de API](#-testes-de-api)
- [🔧 Configuração de Desenvolvimento](#-configuração-de-desenvolvimento)
- [📈 Monitoramento](#-monitoramento)

### ⚙️ Funcionalidades e Recursos
- [📋 Funcionalidades](#-funcionalidades)
  - [👥 Gestão de Usuários](#-gestão-de-usuários)
  - [🏢 Gestão de Salas](#-gestão-de-salas)
  - [📅 Sistema de Reservas](#-sistema-de-reservas)

### 🔧 Suporte e Manutenção
- [🐛 Resolução de Problemas](#-resolução-de-problemas)
- [🛠️ Tecnologias e Versões](#️-tecnologias-e-versões)
- [🤝 Contribuição](#-contribuição)
- [📝 Licença](#-licença)
- [👨‍💻 Autor](#-autor)

</details>

---

## 📋 Visão Geral

Sistema moderno de gerenciamento de reservas de salas baseado em arquitetura de **microserviços**, implementando os princípios de **Domain-Driven Design (DDD)** e **Event-Driven Architecture**. O projeto oferece uma solução completa para o controle de usuários, salas e reservas com comunicação assíncrona entre serviços.

### ✨ Principais Características

- 🔧 **Arquitetura de Microserviços** com isolamento completo
- 📨 **Comunicação Assíncrona** via RabbitMQ
- 🎨 **Interface Moderna** em React com Material-UI
- 🐳 **Containerização Completa** com Docker
- 🔒 **Validação Cross-Service** em tempo real
- 📊 **Monitoramento** integrado via Adminer e RabbitMQ Management
- 🔄 **Tolerância a Falhas** com message queuing
- 🌐 **Load Balancing** via Nginx

### 🔧 Microserviços

| Serviço | Responsabilidade | Porta | Banco de Dados |
|---------|------------------|-------|----------------|
| **ms-usuario** | Gerenciamento de usuários, validação de CPF | 8080 | MySQL (3307) |
| **ms-sala** | Gerenciamento de salas e capacidades | 8081 | MySQL (3308) |
| **ms-reserva** | Orquestração de reservas com validações | 8082 | MySQL (3309) |

### 🔗 Componentes de Infraestrutura

- **Frontend**: Interface React moderna com Material-UI e Tailwind CSS
- **Nginx**: Reverse proxy e load balancer
- **RabbitMQ**: Message broker para comunicação assíncrona
- **Adminer**: Interface web para gerenciamento de bancos de dados
- **MySQL**: Bancos de dados isolados por microserviço

## 🛠️ Stack Tecnológica

### Backend
- **Java 21** - Linguagem de programação moderna
- **Spring Boot 3.4.4** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **Spring AMQP** - Integração com RabbitMQ
- **MySQL Connector** - Driver de banco de dados
- **Lombok** - Redução de boilerplate

### Frontend
- **React 19.1.0** - Biblioteca de interface
- **Material-UI 5.15.0** - Componentes de UI
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP

### Infraestrutura
- **Docker & Docker Compose** - Containerização
- **Nginx** - Reverse proxy
- **RabbitMQ** - Message broker
- **MySQL 8.0** - Banco de dados relacional

## 📡 Padrão de Comunicação

### Comunicação Síncrona (REST APIs)
```
Frontend ←→ Nginx ←→ Microserviços
```

### Comunicação Assíncrona (Event-Driven)
```
ms-reserva → RabbitMQ → ms-usuario
ms-usuario → RabbitMQ → ms-reserva
```

### 🔄 Fluxo de Validação de Reservas

1. **Criação de Reserva**: Cliente envia dados via frontend
2. **Validação Local**: ms-reserva valida dados básicos (data, formato)
3. **Validação Cross-Service**: Envia mensagem para validar usuário
4. **Processamento Assíncrono**: ms-usuario verifica existência do usuário
5. **Resposta**: Confirmação ou rejeição da reserva
6. **Persistência**: Salvamento apenas se todas as validações passarem

**🛡️ Tolerância a Falhas**: Mensagens ficam persistidas no RabbitMQ até que os serviços estejam disponíveis.

## 🚀 Como Executar

### 📋 Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0+)
- 8GB RAM disponível
- Portas livres: 80, 3000, 3307-3309, 4040, 5672, 8080-8082, 15672

### ⚡ Execução Rápida

```bash
# Clone o repositório
git clone https://github.com/LuizPagliari/controle-sala.git
cd controle-sala

# Execute o ambiente completo
docker-compose up --build

# Ou execute em background
docker-compose up --build -d
```

### 🌐 Acessos do Sistema

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface principal do usuário |
| **API Gateway** | http://localhost | Nginx reverse proxy |
| **Adminer** | http://localhost:4040 | Gerenciamento de bancos de dados |
| **RabbitMQ Management** | http://localhost:15672 | Dashboard do message broker |

### 🔗 APIs dos Microserviços

| API | Endpoint | Documentação |
|-----|----------|--------------|
| **Usuários** | http://localhost/api/usuarios | CRUD completo de usuários |
| **Salas** | http://localhost/api/salas | Gerenciamento de salas |
| **Reservas** | http://localhost/api/reservas | Orquestração de reservas |

### 📚 Documentação Swagger

Cada microserviço possui documentação interativa Swagger/OpenAPI 3.0 acessível através dos seguintes endpoints:

| Microserviço | Swagger UI | Documentação JSON |
|--------------|------------|-------------------|
| **ms-usuario** | http://localhost:8080/swagger-ui.html | http://localhost:8080/v3/api-docs |
| **ms-sala** | http://localhost:8081/swagger-ui.html | http://localhost:8081/v3/api-docs |
| **ms-reserva** | http://localhost:8082/swagger-ui.html | http://localhost:8082/v3/api-docs |

#### 🛠️ Funcionalidades da Documentação Swagger

- ✅ **Interface Interativa**: Teste as APIs diretamente no navegador
- ✅ **Esquemas de Dados**: Visualize modelos de request/response
- ✅ **Códigos de Status**: Documentação completa de respostas HTTP
- ✅ **Exemplos de Uso**: Payloads de exemplo para cada endpoint
- ✅ **Autenticação**: (Quando implementada) Teste com tokens/credenciais

#### 📋 Endpoints Documentados

**API de Usuários (`ms-usuario`)**
- `POST /usuarios` - Criar novo usuário
- `GET /usuarios` - Listar todos os usuários  
- `GET /usuarios/{cpf}` - Buscar usuário por CPF

**API de Salas (`ms-sala`)**
- `POST /salas` - Criar nova sala
- `GET /salas` - Listar todas as salas
- `GET /salas/{id}` - Buscar sala por ID

**API de Reservas (`ms-reserva`)**
- `POST /reservas` - Criar nova reserva
- `GET /reservas` - Listar todas as reservas
- `GET /reservas/{id}` - Buscar reserva por ID

### 🗄️ Credenciais de Acesso

#### Bancos de Dados (Adminer)
- **Usuário**: `admin`
- **Senha**: `123`
- **Bancos**: `db_usuario`, `db_sala`, `db_reserva`

#### RabbitMQ Management
- **Usuário**: `admin`
- **Senha**: `admin`

## 📋 Funcionalidades

### 👥 Gestão de Usuários
- ✅ Cadastro com validação de CPF
- ✅ Validação de email único
- ✅ Endereço completo
- ✅ Data de nascimento
- ✅ Listagem e busca

### 🏢 Gestão de Salas
- ✅ Cadastro de salas
- ✅ Definição de capacidade
- ✅ Listagem disponível
- ✅ Busca por ID

### 📅 Sistema de Reservas
- ✅ Agendamento de salas
- ✅ Validação de usuário em tempo real
- ✅ Verificação de disponibilidade
- ✅ Histórico de reservas
- ✅ Interface intuitiva

## 🔧 Configuração de Desenvolvimento

### Estrutura de Rede Docker
```yaml
networks:
  net1: # Usuario + DB
  net2: # Sala + DB  
  net3: # Reserva + DB
  shared: # RabbitMQ + Nginx + Frontend
```

### Variáveis de Ambiente
```bash
# RabbitMQ
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin

# MySQL
MYSQL_ROOT_PASSWORD=123
MYSQL_USER=admin
MYSQL_PASSWORD=123
```

## 🧪 Testes de API

### 🌐 Testes via Swagger

1. **Acesse a documentação Swagger** de qualquer microserviço:
   - Usuario: http://localhost:8080/swagger-ui.html
   - Sala: http://localhost:8081/swagger-ui.html  
   - Reserva: http://localhost:8082/swagger-ui.html

2. **Teste os endpoints diretamente**:
   - Clique em qualquer endpoint para expandir
   - Clique em "Try it out"
   - Preencha os parâmetros necessários
   - Execute e visualize a resposta

3. **Fluxo de teste recomendado**:
   ```
   1️⃣ Criar usuário (POST /usuarios)
   2️⃣ Criar sala (POST /salas)  
   3️⃣ Criar reserva (POST /reservas)
   4️⃣ Listar reservas (GET /reservas)
   ```

### 🔍 Exemplos de Payloads

**Criar Usuário:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "dataNascimento": "1990-01-15",
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234567",
    "rua": "Rua das Flores, 123"
  }
}
```

**Criar Sala:**
```json
{
  "nome": {
    "nome": "Sala de Reunião A"
  },
  "capacidade": {
    "capacidade": 10
  }
}
```

**Criar Reserva:**
```json
{
  "dataHora": "2025-06-15T14:30:00",
  "salaId": 1,
  "usuarioId": 1
}
```

## 📈 Monitoramento

### Métricas Disponíveis
- **RabbitMQ**: Filas, mensagens, conexões
- **MySQL**: Performance via Adminer
- **Nginx**: Logs de acesso
- **Spring Boot**: Logs estruturados

## 🐛 Resolução de Problemas

### Problemas Comuns

#### ❌ "CPF inválido" 
- **Causa**: CPF não atende às regras de validação brasileira
- **Solução**: Use um CPF válido (ex: `12345678901`) ou números diferentes
- **Nota**: CPFs como `11111111111`, `22222222222` são inválidos

#### ❌ "Erro ao criar usuário/sala/reserva"
- **Causa**: Microserviço não está disponível ou BD não conectado
- **Solução**: Verifique se todos os containers estão rodando:
  ```bash
  docker-compose ps
  docker-compose logs [nome-do-serviço]
  ```

#### ❌ "Failed to load resource: 500"
- **Causa**: Erro interno no microserviço
- **Solução**: Verifique logs detalhados:
  ```bash
  docker-compose logs -f ms-usuario
  docker-compose logs -f ms-reserva
  ```

#### ❌ Swagger UI não carrega
- **Causa**: Containers não reconstruídos após adicionar dependências
- **Solução**: Rebuild completo:
  ```bash
  docker-compose down
  docker-compose up --build
  ```

### Logs Úteis
```bash
# Logs em tempo real de todos os serviços
docker-compose logs -f

# Logs específicos por serviço
docker-compose logs -f ms-usuario
docker-compose logs -f ms-sala
docker-compose logs -f ms-reserva
docker-compose logs -f rabbitmq
```

## 🛠️ Tecnologias e Versões

### Backend (Microserviços)
- **Java**: 17+
- **Spring Boot**: 3.x
- **Spring Web**: REST APIs
- **Spring Data JPA**: Persistência de dados
- **Spring AMQP**: Integração RabbitMQ
- **MySQL**: 8.0
- **SpringDoc OpenAPI**: 2.2.0 (Swagger)
- **Maven**: Gerenciamento de dependências

### Frontend
- **React**: 18.x
- **Material-UI**: 5.x
- **Tailwind CSS**: 3.x
- **Axios**: HTTP Client
- **JavaScript ES6+**

### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Nginx**: 1.25 (Reverse Proxy)
- **RabbitMQ**: 3.12 (Message Broker)
- **Adminer**: 4.8 (Database Admin)

### Arquitetura
- **Domain-Driven Design (DDD)**
- **Event-Driven Architecture**
- **Microservices Pattern**
- **CQRS** (parcial)
- **Message Queue Pattern**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Luiz Pagliari**
- GitHub: [@LuizPagliari](https://github.com/LuizPagliari)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**
   
