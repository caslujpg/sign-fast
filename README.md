# Sign Fast

O **Sign Fast** é uma plataforma para assinatura digital de documentos de forma rápida e segura. O sistema permite que os usuários assinem documentos eletronicamente, com uma interface simples e intuitiva.

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Next.js**: Framework para React que permite renderização do lado do servidor e geração estática de sites.
- **Prisma**: ORM (Object-Relational Mapping) para Node.js que facilita a interação com bancos de dados.
- **Tailwind CSS**: Framework utilitário para criar designs rápidos e responsivos.
- **NextAuth.js**: Biblioteca de autenticação para Next.js, facilitando login e controle de sessão de usuários.
- **Radix UI**: Conjunto de componentes de UI com acessibilidade incorporada.
- **React Signature Canvas**: Biblioteca para capturar assinaturas digitais de forma intuitiva.

## Estrutura do projeto
- `src/app`: Páginas e rotas principais da aplicação;
  - `/(auth)`: Lógica de autenticação e gerenciamento de sessão;
  - `/api`: Manipuladores de rotas da API;
  - `/assets`: Arquivos estáticos, como imagens;
  - `/dashboard`: Lógica e componentes da página do dashboard;
- `src/components`: Componentes visuais reutilizaveis;
- `src/lib`: Funções utilitárias, hooks customizados;
- `src/prisma`: Define o modelo do banco de dados e as relações.

## Instalação

1.  Clone este repositório:
  ```bash
    git clone https://github.com/seu-usuario/sign-fast.git
  ```

2.  Navegue até o diretório do projeto:
  ```bash
    cd sign-fast
  ```

3.  Instale as dependências:
  ```bash
    npm install
  ```

4.  Para rodar o projeto em modo de desenvolvimento, use:
  ```bash
    npm run dev
  ```

5.  Para gerar a build do projeto:
  ```bash
    npm run build
  ```

6.  Para iniciar o projeto em produção:
  ```bash
    npm start
  ```

## Configuração do Banco de Dados com Docker

1.  Execute o seguinte comando para subir o container Docker:
  ```bash
    docker-compose up -d
  ```
2.  O banco de dados estará disponível na porta 3306. Verifique se o banco foi criado corretamente utilizando o cliente de sua escolha (MySQL Workbench, DBeaver, etc).

## Rodando as Migrations do Prisma
Após configurar o banco de dados, você precisará rodar as migrations do Prisma para criar as tabelas no banco de dados.

1.  Primeiro, gere o arquivo .env com as credenciais de acesso ao banco de dados. O arquivo deve conter as seguintes variáveis:

2.  Ajuste as credenciais conforme necessário.
 ```env
    DATABASE_URL="mysql://root:root@localhost:3306/sign_fast_db"
  ```

3.  Rode as migrations com o seguinte comando:
<br />
(Esse comando cria as tabelas no banco de dados e aplica as migrations pendentes.)
  ```bash
    npx prisma migrate dev
  ```

4.  Após rodar as migrations, você pode gerar o cliente Prisma com o comando:
  ```bash
    npx prisma generate
  ```

## Funcionalidades
#### Assinatura de Documentos:
Os usuários podem assinar documentos diretamente na plataforma utilizando o canvas de assinatura.

#### Autenticação:
Através do NextAuth.js, a aplicação permite login e logout, garantindo a segurança do processo de assinatura.

#### Gestão de Documentos: 
Usuários podem gerenciar seus documentos assinados de forma fácil e intuitiva.

## Dependências
* Prisma: Utilizado para interagir com o banco de dados MySQL.

* bcrypt-ts: Para criptografia de senhas dos usuários.

* clsx e tailwind-variants: Para gerenciamento de classes e estilo responsivo.

* lucide-react: Para ícones responsivos e modernos.

* react-signature-canvas: Para capturar a assinatura do usuário diretamente na tela.

### Ambiente de Desenvolvimento
* Node.js: Versão 16 ou superior.

* MySQL: Banco de dados utilizado pela aplicação. Certifique-se de configurar o banco corretamente com Docker.


## Licença  
Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

Desenvolvido por Lucas Leonardo

[Linkedin](https://www.linkedin.com/in/caslujpg/)</br>
[Email](caslujpg@gmail.com)