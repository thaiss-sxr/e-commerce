// Carrega o módulo express na memória
const express = require("express");
// Carrega o módulo dotenv para ler variáveis de ambiente
require("dotenv").config();
// Carrega o módulo mysql2/promise para conectar ao banco de dados MySQL
const mysql = require("mysql2/promise");

const bodyParser = require("body-parser");
// Configura o body-parser para analisar o corpo das requisições

// Criar a instância do express
const app = express();

// Configurar a porta do servidor
const port = process.env.PORT || 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Adicionar o cors para permitir requisições de outros domínios
const cors = require("cors");
app.use(cors());

/* ROTAS DA LOJA DE MAQUIAGEM */

// Statement SQL para inserir um produto
const sqlInsertProduto = `
INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES (?, ?, ?, ?, ?, ?)
`;

// Rota de API para cadastrar um produto
app.post("/api/produtos", async (req, res) => {
  const { nome, descricao, preco, estoque, categoria_id, imagem_url } = req.body;
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });
    await connection.execute(sqlInsertProduto, [nome, descricao, preco, estoque, categoria_id, imagem_url]);
    connection.end();
    return res.status(201).json({ message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    return res
    .status(500)
    .json({ error: "Erro ao cadastrar produto" });
  }
});

// Statement SQL que lista todos os produtos com categoria
const sqlListarProdutos = `
SELECT p.produto_id, p.nome, p.descricao, p.preco, p.estoque, c.nome AS categoria, p.imagem_url
FROM produto p
LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
`;


// Rota de API para listar todos os produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });
    // Executa o statement SQL
    const [rows] = await connection.execute(sqlListarProdutos);
    connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    //exibe o erro no console
    console.error("Erro ao conectar ao banco de dados:", error);
     // Retorna ao cliente a mensagem de erro
    return res
    .status(500)
    .json({ error: "Erro ao buscar produtos" });
  }
});


// Colocar instância para rodar
const ipAddress = process.env.IP_ADDRESS || "localhost";
app.listen(port, ipAddress, () => {
  console.log(`Servidor de API está rodando em http://${ipAddress}:${port}`);
});

// Statement SQL para buscar um produto pelo ID
const sqlBuscarProdutoPorId = `
SELECT p.produto_id, p.nome, p.descricao, p.preco, p.estoque, c.nome AS categoria, p.imagem_url
FROM produto p
LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
WHERE p.produto_id = ?
`;


// Rota de API para buscar produto por ID
app.get("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do produto é obrigatório" });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

    const [rows] = await connection.execute(sqlBuscarProdutoPorId, [id]);
    connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// aqui termina a rota de buscar produto por ID

// Statement SQL para atualizar um produto
const sqlAtualizarProduto = `
UPDATE produto
SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria_id = ?, imagem_url = ?
WHERE produto_id = ?
`;

// Rota de API para atualizar produto
app.put("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, categoria_id, imagem_url } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

    const [result] = await connection.execute(sqlAtualizarProduto, [
      nome, descricao, preco, estoque, categoria_id, imagem_url, id
    ]);
    connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Statement SQL para excluir um produto
const sqlExcluirProduto = `
DELETE FROM produto WHERE produto_id = ?
`;

// Rota de API para excluir produto
app.delete("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

    const [result] = await connection.execute(sqlExcluirProduto, [id]);
    connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

//ROTA DE PRODUTOS TERMINA AQUI

/* ROTAS DE CATEGORIAS */

// Rota para listar categorias
// Statement SQL para listar categorias
const sqlListarCategorias = `
SELECT *
FROM categoria
`;

app.get("/api/categorias", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });
    const [rows] = await connection.execute(sqlListarCategorias);
    connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});


// Rota para buscar produtos por categoria
// Statement SQL para buscar produtos por categoria
const sqlProdutosPorCategoria = `
SELECT p.produto_id, p.nome, p.descricao, p.preco, p.estoque, c.nome AS categoria
FROM produto p
JOIN categoria c ON p.categoria_id = c.categoria_id
WHERE c.categoria_id = ?
`;

app.get("/api/produtos/categoria/:categoria_id", async (req, res) => {
  try {
    const connection = await mysql.createConnection({ 
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });
    const [rows] = await connection.execute(sqlProdutosPorCategoria, [req.params.categoria_id]);
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos por categoria" });
  }
});

//ROTA DE CATEGORIAS TERMINA AQUI

//ROTA DE USUARIOS
// Rota de API para cadastrar usuário
//Statement SQL para cadastrar usuário
const sqlInserirUsuario = `
      INSERT INTO usuario (nome, email, senha)
      VALUES (?, ?, ?)
    `;

app.post("/api/usuarios", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'loja',
    });

    const { nome, email, senha } = req.body;

    const [result] = await connection.execute(sqlInserirUsuario, [nome, email, senha]);
    connection.end();

    return res.status(201).json({ id: result.insertId, nome, email });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

//teste aqui
//rota de login
//Statement SQL para autenticar usuário
const sqlAutenticarUsuario = `
      SELECT usuario_id, nome, email
      FROM usuario
      WHERE email = ? AND senha = ?
    `;

    app.post ("/api/usuarios/autenticar", async (req, res) => {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'loja',
        });

        const [rows] = await connection.execute(sqlAutenticarUsuario, [req.body.email, req.body.senha]);
        connection.end();

        if (rows.length === 0) {
          return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        return res.status(200).json({ usuario: rows[0] });
      } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        return res.status(500).json({ error: "Erro ao autenticar usuário" });
      }
    });

//ROTA DE USUARIOS TERMINA AQUI
 
//estudar melhor isso
//rota de adicionar produto ao carrinho
//Statement SQL para adicionar produto ao carrinho
const sqlAdicionarAoCarrinho = `
      INSERT INTO carrinho (usuario_id, produto_id, quantidade)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantidade = quantidade + ?
    `;
app.post("/api/carrinho", async (req, res) => {
  const { usuario_id, produto_id, quantidade } = req.body;

  try {
    const connection = await mysql.createConnection ({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

     // Verificar se o carrinho do usuário existe
    const [carrinhoExistente] = await connection.execute(
      "SELECT carrinho_id FROM carrinho WHERE usuario_id = ?",
      [usuario_id]
    );

    let carrinhoId;

    if (carrinhoExistente.length === 0) {
      // Se não existe, cria o carrinho
      const [resultado] = await connection.execute(
        "INSERT INTO carrinho (usuario_id) VALUES (?)",
        [usuario_id]
      );
      carrinhoId = resultado.insertId;
    } else {
      carrinhoId = carrinhoExistente[0].carrinho_id;
    }

    // Verificar se o produto já está no carrinho
    const [itemExistente] = await connection.execute(
      "SELECT carrinho_item_id, quantidade FROM carrinho_item WHERE carrinho_id = ? AND produto_id = ?",
      [carrinhoId, produto_id]
    );

    if (itemExistente.length === 0) {
      // Inserir novo item
      await connection.execute(
        "INSERT INTO carrinho_item (carrinho_id, produto_id, quantidade) VALUES (?, ?, ?)",
        [carrinhoId, produto_id, quantidade]
      );
    } else {
      // Atualizar quantidade do item existente
      const novaQuantidade = itemExistente[0].quantidade + quantidade;
      await connection.execute(
        "UPDATE carrinho_item SET quantidade = ? WHERE carrinho_item_id = ?",
        [novaQuantidade, itemExistente[0].carrinho_item_id]
      );
    }

    res.status(200).json({ message: "Produto adicionado ao carrinho com sucesso!" });
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar produto ao carrinho" });
  }
});
  
//rota de listar produtos do carrinho
//Statement SQL para listar produtos do carrinho
const sqlListarCarrinho = `
SELECT ci.carrinho_item_id, p.produto_id, p.nome, p.preco, ci.quantidade
FROM carrinho_item ci
JOIN produto p ON ci.produto_id = p.produto_id
WHERE ci.carrinho_id = ?
`;
app.get("/api/carrinho/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const connection = await mysql.createConnection ({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'loja',
    });

    const [rows] = await connection.execute(sqlListarCarrinho, [usuario_id]);
    connection.end();

    return res.status(200).json({ produtos: rows });
  } catch (error) {
    console.error("Erro ao listar produtos do carrinho:", error);
    return res.status(500).json({ error: "Erro ao listar produtos do carrinho" });
  }
});

//rota de atualizar produto do carrinho
//Statement SQL para atualizar produto do carrinho
const sqlAtualizarCarrinho = `
UPDATE carrinho_item 
SET quantidade = ?
WHERE carrinho_item_id = ? 
AND carrinho_id = (SELECT carrinho_id FROM carrinho WHERE usuario_id = ?)
`;
app.put("/api/carrinho/:carrinho_item_id", async (req, res) => {
  const { carrinho_item_id } = req.params;
  const { quantidade, usuario_id } = req.body;
  try{
    const connection = await mysql.createConnection ({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'loja',
    });

    await connection.execute(sqlAtualizarCarrinho, [quantidade, carrinho_item_id, usuario_id]);
    connection.end();

    return res.status(200).json({ message: "Produto atualizado no carrinho com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto do carrinho:", error);
    return res.status(500).json({ error: "Erro ao atualizar produto do carrinho" });
  }
});

//rota de pagamento pix e cartão
//Statement SQL para criar pedido
app.post("/api/pedidos", async (req, res) => {
  const { usuario_id, tipo_pagamento_id } = req.body;

  if (!usuario_id || !tipo_pagamento_id) {
    return res.status(400).json({ error: "Usuário e tipo de pagamento são obrigatórios" });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

    // Busca itens do carrinho
    const [itensCarrinho] = await connection.execute(
      `SELECT ci.produto_id, ci.quantidade, p.preco AS preco_unitario
       FROM carrinho_item ci
       INNER JOIN carrinho c ON ci.carrinho_id = c.carrinho_id
       INNER JOIN produto p ON ci.produto_id = p.produto_id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );

    if (itensCarrinho.length === 0) {
      await connection.end();
      return res.status(400).json({ error: "Carrinho vazio" });
    }
    console.log(itensCarrinho);

    // Calcula valor total
    let valor_total = 0;
    for (let item of itensCarrinho) {
      valor_total += item.preco_unitario * item.quantidade;
    }

    // Cria o pedido com valor total
    const [pedidoResult] = await connection.execute(
      "INSERT INTO pedido (usuario_id, valor_total, tipo_pagamento_id, status) VALUES (?, ?, ?, ?)",
      [usuario_id, valor_total, tipo_pagamento_id, "Concluído"]
    );
    const pedidoId = pedidoResult.insertId;

    // Copia itens para pedido_item
    for (let item of itensCarrinho) {
      await connection.execute(
        "INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    // Esvazia o carrinho
    await connection.execute(
      `DELETE ci FROM carrinho_item ci
       INNER JOIN carrinho c ON ci.carrinho_id = c.carrinho_id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );

    // Busca o nome do tipo de pagamento
    const [tipoPagamento] = await connection.execute(
      "SELECT nome FROM tipo_pagamento WHERE tipo_pagamento_id = ?",
      [tipo_pagamento_id]
    );

    await connection.end();

    // Retorna resposta
    res.status(201).json({
      message: "Pedido criado com sucesso!",
      pedido_id: pedidoId,
      tipo_pagamento: tipoPagamento[0].nome,
      status: "Concluído",
      valor_total,
      itens: itensCarrinho
    });

  } catch (error) {
    console.error("Erro ao criar pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

//testar
// Rota para remover um item do carrinho
app.delete("/api/carrinho/:carrinho_item_id", async (req, res) => {
  const { carrinho_item_id } = req.params;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "loja",
    });

    const [result] = await connection.execute(
      "DELETE FROM carrinho_item WHERE carrinho_item_id = ?",
      [carrinho_item_id]
    );

    connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item não encontrado no carrinho" });
    }

    return res.status(200).json({ message: "Item removido do carrinho com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    return res.status(500).json({ error: "Erro ao remover item do carrinho" });
  }
});