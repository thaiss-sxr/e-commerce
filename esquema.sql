CREATE TABLE usuario (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL,
    senha VARCHAR (100) NOT NULL
);

CREATE TABLE produto (
    produto_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR (100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL,
    categoria_id INT,
    imagem_url VARCHAR(255),
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
);

CREATE TABLE login (
    login_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) DEFAULT NULL,
    data_criacao DATETIME NOT NULL,
    data_att DATETIME NOT NULL
);


CREATE TABLE categoria (
    categoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR (100) NOT NULL
);

CREATE TABLE pedido (
    pedido_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    data_pedido DATETIME NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

-- Tabela para carrinho de compras
CREATE TABLE carrinho (
    carrinho_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE carrinho_item (
    carrinho_item_id INT PRIMARY KEY AUTO_INCREMENT,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (carrinho_id) REFERENCES carrinho(carrinho_id),
    FOREIGN KEY (produto_id) REFERENCES produto(produto_id)
);

--pedidos
CREATE TABLE pedido (
    pedido_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_pagamento ENUM('Pix','Cartão'),
    status ENUM('Pendente','Concluído') DEFAULT 'Pendente',
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE pedido_item (
    pedido_item_id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT DEFAULT 1,
    preco DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES pedido(pedido_id),
    FOREIGN KEY (produto_id) REFERENCES produto(produto_id)
);

CREATE TABLE tipo_pagamento (
    tipo_pagamento_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);
--fim de tabelas

-- Inserir usuários
INSERT INTO usuario (nome, email, senha) VALUES
('Ana Souza', 'ana@gmail.com', '123456'),
('Bruna Lima', 'bruna@gmail.com', 'abc123'),
('Carla Pereira', 'carla@gmail.com', 'senha123');

INSERT INTO usuario (nome, email, senha) VALUES
('Daniela Silva', 'daniela@gmail.com', 'senha456'),
('Eduarda Ribeiro', 'eduarda@gmail.com', 'senha321'),
('Luana Ferreira', 'luana@gmail.com', 'senha654');

-- Inserir categorias
INSERT INTO categoria (nome) VALUES
('Batom'),
('Base'),
('Rímel'),
('Sombras'),
('Pincéis'),
('Delineador'),       -- id 6

INSERT INTO categoria (nome)
VALUES 
('Blush'),            
('Iluminador'); 

('Máscara Facial');   -- id 9

INSERT INTO tipo_pagamento (nome) VALUES
('Pix'),
('Cartão');

UPDATE pedido
SET data_pedido = '2025-08-10 10:00:00'
WHERE pedido_id = 1;

UPDATE produto
SET produto_id = 8
WHERE produto_id = 10;

UPDATE produto
SET nome = 'Batom Matte Vermelho',
descricao = 'Batom de longa duração, acabamento matte', 
preco = 29.90,  
estoque = 50,
categoria_id = 1,
imagem_url = 'batom-vermelho.jpg'
WHERE produto_id = 1;

UPDATE produto
SET nome = 'Base líquida Bege Médio'
WHERE produto_id = 2;

UPDATE produto
SET categoria_id = 3
WHERE produto_id = 5;

UPDATE produto
SET categoria_id = 4
WHERE produto_id = 5;

--.
UPDATE produto
SET produto_id = 8
WHERE produto_id = 18;

UPDATE produto
SET nome = 'Base líquida Bege Médio',
descricao = 'cobertura média, acabamento natural',
preco = 59.90,  
estoque = 30,
categoria_id = 2,
imagem_url = 'base-bege.jpg'
WHERE produto_id = 2;

DROP TABLE IF EXISTS pedido_item;

 DELETE FROM usuario
 WHERE usuario_id = 11;

  DELETE FROM usuario
 WHERE usuario_id = 9;
 
DELETE FROM produto
 WHERE produto_id = 22;

 DELETE FROM produto
 WHERE produto_id = 15;

-- se tiver que adicionar mais um produto: (mude os ID)

-- Produto 
INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES ('Blush Rosado', 'Blush em pó para dar cor às bochechas', 40.00, 30, 7, 'blush-rosado.jpg');

-- Produto 
INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES ('Iluminador Facial', 'Iluminador em pó compacto', 55.00, 20, 8, 'iluminador-facial.jpg');

-- Produto 
INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES ('Máscara Facial Hidratante', 'Máscara facial para hidratação profunda', 60.00, 15, 9, 'mascara-facial.jpg');

-- Inserir produtos
INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url) VALUES
('Batom Matte Vermelho', 'Batom de longa duração, acabamento matte', 29.90, 50, 1, 'batom-vermelho.jpg'),
('Base Líquida Bege Médio', 'Cobertura média, acabamento natural', 59.90, 30, 2, 'base-bege.jpg'),
('Paleta de Sombras Nude', '12 cores neutras para uso diário', 89.90, 20, 3, 'sombras-nude.jpg'),
('Pincel Kabuki', 'Pincel para aplicação de base líquida e pó', 35.00, 15, 4, 'pincel-kabuki.jpg');

INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES (
  'Rímel Alongamento Preto',
  'Máscara de cílios que proporciona volume e alongamento, efeito preto intenso',
  49.90,
  25,
  3,
  'rimel-alongamento-preto.jpg'
);

{
  "nome": "Base líquida Bege Médio",
  "descricao": "Base de alta cobertura e longa duração",
  "preco": 89.90,
  "estoque": 15,
  "categoria_id": 2,
  "imagem_url": "https://meusite.com/imagens/base-liquida.jpg"
}

{
  "nome": "Batom Vermelho",
  "descricao": "Batom matte de longa duração",
  "preco": 29.90,
  "estoque": 15,
  "categoria_id": 1,
  "imagem_url": "https://exemplo.com/batom-vermelho.jpg"
}


INSERT INTO produto (nome, descricao, preco, estoque, categoria_id, imagem_url)
VALUES ('Produto Teste', 'Apenas teste', 0.1, 3, 3, NULL);

-- Inserir pedidos
INSERT INTO pedido (usuario_id, data_pedido, valor_total) VALUES
(1, '2025-08-10', 59.80),
(2, '2025-08-11', 149.80);

INSERT INTO pedido (usuario_id, data_pedido, valor_total) VALUES
(3, '2025-08-12', 29.90);
(4, '2025-08-13', 89.90);
(5, '2025-08-14', 119.80);
(6, '2025-08-15', 35.00);

-- Inserir itens do pedido
INSERT INTO pedido_id (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 29.90),
(2, 2, 1, 59.90),
(2, 3, 1, 89.90);

UPDATE pedido
SET valor_total = 9.90
WHERE valor_total = 59.80;

--Listar todos os produtos com suas categorias
SELECT p.produto_id, p.nome AS produto, c.nome AS categoria, p.preco, p.estoque
FROM produto p
JOIN categoria c ON p.categoria_id = c.categoria_id;

--Listar pedidos com nome do cliente e valor total
SELECT pe.pedido_id, u.nome AS cliente, pe.valor_total
FROM pedido pe
JOIN usuario u ON pe.usuario_id = u.usuario_id;

--Listar todos os itens de cada pedido com nome do produto
SELECT pe.pedido_id, u.nome AS cliente, pr.nome AS produto, ip.quantidade, ip.preco_unitario
FROM pedido_id 
JOIN pedido pe ON ip.pedido_id = pe.pedido_id
JOIN usuario u ON pe.usuario_id = u.usuario_id
JOIN produto pr ON ip.produto_id = pr.produto_id;

-- Ver total de produtos vendidos por categoria
SELECT c.nome AS categoria, SUM(ip.quantidade) AS total_vendidos
FROM pedido_id
JOIN produto p ON ip.produto_id = p.produto_id
JOIN categoria c ON p.categoria_id = c.categoria_id
GROUP BY c.nome;

--Listar clientes e quantos pedidos cada um já fez
SELECT u.nome, COUNT(pe.pedido_id) AS total_pedidos
FROM usuario u
LEFT JOIN pedido pe ON u.usuario_id = pe.usuario_id
GROUP BY u.nome;

--listar nomes de clientes e ordem alfabética
SELECT nome 
FROM usuario
ORDER BY nome;

--Mostrar todos os produtos acima de R$100, em ordem de preço
SELECT nome, preco 
FROM produto 
WHERE preco > 100 
ORDER BY preco DESC;

--Mostrar todos os produtos acima de R$20, em ordem de preço descrescente
SELECT nome, preco 
FROM produto 
WHERE preco > 20 
ORDER BY preco DESC;

--Mostrar todos os produtos acima de R$20, em ordem de preço crescente
SELECT nome, preco 
FROM produto 
WHERE preco > 20 
ORDER BY preco ASC;

--Mostrar todos os produtos abaixo de R$20, em ordem de preço decrescente
SELECT nome, preco 
FROM produto 
WHERE preco < 20 
ORDER BY preco DESC;

--Quantidade de produtos por categoria
SELECT c.nome AS categoria, COUNT(p.produto_id) AS total_produtos
FROM categoria c
LEFT JOIN produto p ON c.categoria_id = p.categoria_id
GROUP BY c.nome;

--Listar os produtos com estoque abaixo de 30 unidades
SELECT p.nome, p.estoque
FROM produto p
WHERE p.estoque < 30;

--Listar usuários que nunca compraram nada
SELECT u.nome
FROM usuario u
LEFT JOIN pedido p ON u.usuario_id = p.usuario_id
WHERE p.pedido_id IS NULL;

--Listar usuários que fizeram pedidos com valor total maior que a média de todos os pedidos
SELECT nome, email, valor_total
FROM usuario u
JOIN pedido p ON u.usuario_id = p.usuario_id
WHERE p.valor_total > (
    SELECT AVG(valor_total)
    FROM pedido
);

--listar descrição do produto com id 1
SELECT p.produto_id, p.nome, p.descricao, p.preco, p.estoque, c.nome AS categoria, p.imagem_url
FROM produto p
LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
WHERE p.produto_id = 1;


--conferir abaixo se a consulta acima está correta
 
 --Listar produtos que nunca foram comprados em nenhum pedido
SELECT nome, preco
FROM produto
WHERE produto_id NOT IN (
    SELECT produto_id
    FROM pedido_id
);
--Listar os pedidos com o total calculado pelos itens do pedido (quantidade x preco_unitario) — para conferir se bate com valor_total
SELECT p.pedido_id, p.usuario_id, p.valor_total,
       (SELECT SUM(quantidade * preco_unitario) FROM pedido_id WHERE pedido_id = p.pedido_id) AS total_calculado
FROM pedido p;

--Listar categorias com a soma do estoque dos produtos, apenas as que têm estoque maior que 30
SELECT c.nome AS categoria, SUM(p.estoque) AS estoque_total
FROM categoria c
JOIN produto p ON c.categoria_id = p.categoria_id
GROUP BY c.categoria_id
HAVING SUM(p.estoque) > 30;

--Listar os 3 usuários que mais gastaram no total de pedidos (soma de valor_total)
SELECT u.usuario_id, u.nome, SUM(p.valor_total) AS total_gasto
FROM usuario u
JOIN pedido p ON u.usuario_id = p.usuario_id
GROUP BY u.usuario_id
ORDER BY total_gasto DESC
LIMIT 3;

--Listar os produtos com o preço acima da média de preço dos produtos da mesma categoria

SELECT p.nome, p.preco, c.nome AS categoria
FROM produto p
JOIN categoria c ON p.categoria_id = c.categoria_id
WHERE p.preco > (
    SELECT AVG(p2.preco)
    FROM produto p2
    WHERE p2.categoria_id = p.categoria_id
);
--Listar usuários que fizeram pedidos nos últimos 5 dias, incluindo o total gasto por pedido e o número de itens por pedido (usando subconsulta)

SELECT u.nome, p.pedido_id, p.data_pedido, p.valor_total,
       (SELECT SUM(quantidade) FROM pedido_id WHERE pedido_id = p.pedido_id) AS total_itens
FROM usuario u
JOIN pedido p ON u.usuario_id = p.usuario_id
WHERE p.data_pedido >= DATE_SUB(CURDATE(), INTERVAL 5 DAY);

mkdir loja
cd loja

