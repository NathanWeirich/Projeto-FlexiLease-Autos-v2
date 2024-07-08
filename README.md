# FlexiLease Autos

API para aluguel de carros.

## Tabela de Conteúdos

- [Descrição](#descrição)

- [Instalação](#instalação)

- [Uso](#uso)

- [Rotas da API](#rotas-da-api)

- [Configuração](#configuração)

- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Descrição

O FlexiLease Autos é uma API voltada para o aluguel de carros de todos os tipos e modelos.

## Instalação

Passos para instalar e configurar o projeto localmente:

1. Clone o repositório:

```bash

git clone https://github.com/NathanWeirich/Projeto-FlexiLease-Autos-v2.git

```

2. Navegue até o diretório do projeto:

```bash

cd Projeto-FlexiLease-Autos-v2

```

3. Instale as dependências:

```bash

npm install

```

4. Configure as variáveis de ambiente conforme o arquivo `.env.example`.

## Uso

Instruções para executar o projeto localmente:

1. Rode o comando:

```bash

npm run build

```

2. Inicie o servidor:

```bash

npm start

```

3. Utilize `http://localhost:3000/` no postman para acessar as rotas.

## Rotas da API

Lista das principais rotas disponíveis na API:

### Usuários

- **POST /api/v1/user**

- Descrição: Cria um novo usuário.

- Body:

```json
{
  "name": "joao",
  "cpf": "123.456.789-00",
  "birth": "01/01/2000",
  "email": "joao@email.com",
  "password": "123565",
  "cep": "01001000",
  "qualified": "sim"
}
```

- **GET /api/v1/user**

- Descrição: Lista todos os usuários.

- **GET /api/v1/user/:id**

- Descrição: Busca um usuário por ID.

- **PUT /api/v1/user/:id**

- Descrição: Atualiza um usuário por ID.

- Body:

```json
{
  "name": "joao",
  "cpf": "123.456.789-00",
  "birth": "10/10/2000",
  "email": "joao@email.com",
  "password": "123565",
  "cep": "01001000",
  "qualified": "sim"
}
```

- **DELETE /api/v1/user/:id**

- Descrição: Deleta um usuário pelo ID.
- **PUT /api/v1/user/:id**

- Descrição: Atualiza um usuário por ID.

- Body:

```json
{
  "email": "joao@email.com",
  "password": "123565"
}
```

### Carros

- **POST /api/v1/car**

- Descrição: Cria um novo carro.

- Body:

```json
{
  "model": "BMW",
  "color": "White",
  "year": "2024",
  "value_per_day": 50,
  "accessories": [
    {
      "description": "air conditioner"
    }
  ],
  "number_of_passengers": 5
}
```

- **GET /api/v1/car**

- Descrição: Lista todos os carros.

- **GET /api/v1/car/:id**

- Descrição: Busca um carro por ID.

- **PUT /api/v1/car/:id**

- Descrição: Atualiza um carro por ID.

- Body:

```json
{
  "model": "BMW",
  "color": "White",
  "year": "2024",
  "value_per_day": 50,
  "accessories": [
    {
      "description": "air conditioner"
    },
    {
      "description": "4x4 traction"
    }
  ],
  "number_of_passengers": 5
}
```

- **DELETE /api/v1/car/:id**

- Descrição: Remove um carro por ID.

- **PATCH /api/v1/car/:id/accessories/:accessoryId**

- Descrição: Atualiza um acessório de um carro.

- Body:

```json
{
  "description": "4 ports"
}
```

### Reservas

- **POST /api/v1/reserve**

- Descrição: Cria uma nova reserva.

- Body:

```json
{
  "start_date": "01/01/2023",
  "end_date": "10/01/2023",
  "id_car": "6684e04234d7c1df4ae7c713",
  "id_user": "668587dbd986c1b281db95de"
}
```

- **GET /api/v1/reserve**

- Descrição: Lista todas as reservas.

- **GET /api/v1/reserve/:id**

- Descrição: Busca uma reserva por ID.

- **PUT /api/v1/reserve/:id**

- Descrição: Atualiza uma reserva por ID.

- Body:

```json
{
  "start_date": "10/01/2023",
  "end_date": "20/01/2023",
  "id_car": "6684e04234d7c1df4ae7c713",
  "id_user": "668587dbd986c1b281db95de"
}
```

- **DELETE /api/v1/reserve/:id**

- Descrição: Deleta uma reserva pelo ID.

## Configuração

Crie um arquivo chamado **.env** no diretorio raiz e adicione as variaveis contidas no arquivo **.env.exemple**:

```plaintext

PORT=3000

MONGODB_URI=mongodb://localhost:27017/flexilease_auto

JWT_SECRET=secret
```

## Tecnologias Utilizadas

- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código, tornando o desenvolvimento mais robusto e menos propenso a erros.
- **Node.js**: Ambiente de execução para JavaScript que permite a construção de aplicações escaláveis e de alta performance no lado do servidor.
- **Express**: Framework web para Node.js que facilita a criação de APIs e aplicações web, simplificando o gerenciamento de rotas, requisições e respostas.
- **Mongoose**: Biblioteca para modelagem de dados em MongoDB, que fornece uma solução baseada em esquemas para validação e conversão de dados.
- **Tsyringe**: Container de injeção de dependência para TypeScript, que ajuda na construção de aplicações mais moduladas e de fácil manutenção.
- **bcrypt**: Biblioteca para hash de senhas, garantindo que as senhas dos usuários sejam armazenadas de forma segura.
- **jsonwebtoken (JWT)**: Biblioteca para criação e verificação de tokens de autenticação, permitindo a implementação de autenticação segura nas rotas protegidas.
- **Axios**: Biblioteca de cliente HTTP para fazer requisições, utilizada para comunicação com a API Via CEP para obter o endereço completo a partir do CEP.
- **Swagger**: Ferramenta para documentação de APIs, que permite a criação de uma interface interativa para testar e visualizar as rotas disponíveis.
- **Joi**: Biblioteca para validação de dados, que garante que os dados enviados nas requisições estejam no formato correto e dentro dos critérios especificados.
- **Jest**: Framework de testes para JavaScript, que facilita a criação e execução de testes unitários, garantindo a qualidade e funcionalidade do código.
