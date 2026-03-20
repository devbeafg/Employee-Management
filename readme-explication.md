# Employee-Management - Explicação da Correção

## Contexto

- Aplicação Frontend (React + Vite) faz requisição para:
  - `GET http://localhost:3000/api/employee`
- Backend (Express + PostgreSQL) escuta na porta 3000.

## Problema identificado

- Erro no navegador:
  - `GET http://localhost:3000/api/employee net::ERR_CONNECTION_REFUSED`
- Indica que, quando a requisição é feita, não há resposta HTTP do servidor na porta 3000.
- No entanto, o servidor backend estava configurado corretamente e iniciava.

## Descoberta chave

- A parte de conexão com PostgreSQL estava funcionando (pool conectado).
- O problema real foi que as estruturas de banco (`role_type` e `employee_details`) não tinham sido criadas automaticamente.
- A rota `GET /api/employee` executa lógica de validação via `SELECT to_regclass('employee_details')` e, se não existir, tenta criar:
  - `CREATE TYPE role_type AS ENUM(...)`
  - `CREATE TABLE employee_details(...)`
- Na prática, esses DDLs não se materializaram, e a rota voltava falhas.

## Solução aplicada

1. No pgAdmin, executou-se manualmente:
   - `CREATE TYPE role_type AS ENUM('Developer', 'Manager', 'Sales', 'Admin', 'Intern');`
   - `CREATE TABLE employee_details(...);`
   - `SELECT * FROM employee_details;`
2. Reiniciou backend e frontend.
3. Rota passou a funcionar, retornando JSON (mesmo se lista vazia), e erro `ERR_CONNECTION_REFUSED` desapareceu.

## Observação para robustez futura

- Recomendado melhorar as queries de criação para `IF NOT EXISTS`:
  - `CREATE TYPE IF NOT EXISTS role_type AS ENUM(...)`
  - `CREATE TABLE IF NOT EXISTS employee_details(...)`
- Adicionar scripts de migração/seed para inicializar DB automaticamente.

## Conclusão

- Solução: criar manualmente os objetos ausentes no PostgreSQL e reiniciar as aplicações.
- Causa: tabelas/enum não existiam no banco no momento em que a rota foi chamada.
- Resultado: aplicação de fullstack voltou a funcionar normalmente.
