const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Permite que o servidor receba dados em formato JSON e aceite conexões do HTML
app.use(cors());
app.use(express.json());

// Configuração da conexão com o teu PostgreSQL (Ajusta a senha se mudaste na instalação!)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_db',
    password: '@Andrade939.', // <-- ATENÇÃO: Substitui pela senha do teu pgAdmin
    port: 5432,
});

// Rota para buscar todas as tarefas do banco de dados
app.get('/tarefas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarefas ORDER BY id ASC');
        res.json(resultado.rows);
    } catch (err) {
        console.error(err.message);
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
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em https://gerenciador-tarefas-n7fj.onrender.com`);
});