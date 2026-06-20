const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Permite que o servidor receba dados em formato JSON e aceite conexões do HTML
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO CORRIGIDA PARA A RENDER:
// O process.env.DATABASE_URL vai ler automaticamente as credenciais do banco na nuvem.
// Caso não exista (se rodar no PC), ele usa uma string vazia ou as credenciais locais por segurança.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Obrigatório para aceitar conexões seguras na Render
    }
});

// Rota para buscar todas as tarefas do banco de dados
app.get('/tarefas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarefas ORDER BY id ASC');
        res.json(resultado.rows);
    } catch (err) {
        console.error("Erro na rota GET /tarefas:", err.message);
        res.status(500).send("Erro no servidor");
    }
});

// Rota para adicionar uma nova tarefa
app.post('/tarefas', async (req, res) => {
    try {
        const { titulo } = req.body;
        const novaTarefa = await pool.query(
            'INSERT INTO tarefas (titulo) VALUES ($1) RETURNING *',
            [titulo]
        );
        res.json(novaTarefa.rows[0]);
    } catch (err) {
        console.error("Erro na rota POST /tarefas:", err.message);
        res.status(500).send("Erro no servidor");
    }
});

// Inicia o servidor dinamicamente
app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`);
});