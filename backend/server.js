import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware para ler JSON e URL-encoded
app.use(express.json()) // Para JSON
app.use(express.urlencoded({ extended: true })) // Para formulário HTML

// Configuração do CORS
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // ou lista de origens específicas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

// Conexão com o MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
  try {
    // Adiciona verificação extra para evitar destructuring em undefined
    if (!req.body) {
      return res.status(400).json({ error: 'Corpo da requisição vazio' })
    }

    const { email, senha, endereco } = req.body

    if (!email || !senha) return res.status(400).json({ error: 'Preencha email e senha.' })
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email inválido.' })

    const [existing] = await pool.query('SELECT * FROM login WHERE email = ?', [email])
    if (existing.length > 0) return res.status(409).json({ error: 'Email já cadastrado.' })

    const senhaHash = await bcrypt.hash(senha, 12)
    const dataAtual = new Date()

    if (endereco) {
      await pool.query(
        'INSERT INTO login (email, senha_hash, data_criacao, data_att, endereco) VALUES (?, ?, ?, ?, ?)',
        [email, senhaHash, dataAtual, dataAtual, endereco]
      )
    } else {
      await pool.query(
        'INSERT INTO login (email, senha_hash, data_criacao, data_att) VALUES (?, ?, ?, ?)',
        [email, senhaHash, dataAtual, dataAtual]
      )
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
  } catch (error) {
    console.error('Erro no cadastro:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
