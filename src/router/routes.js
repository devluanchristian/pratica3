import { Router } from "express";
import { db } from "../data/db.js";

export const appRoutes = Router()

appRoutes.get('/', (req, res) => {
  res.render('index');
});

appRoutes.get('/movies', (req, res) => {
  connection.query('SELECT * FROM `movies`', function (err, results, fields) {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
      }
      res.render('movies', {movies: results})
      // res.json(results); // Envia os resultados como resposta no formato JSON
  });
});

appRoutes.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM `movies` WHERE cod = ?';

  db.query(query, [id], function (err, results, fields) {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Filme não encontrado' });
      }

      res.json(results[0]); // Envia o primeiro resultado como resposta no formato JSON
  });
});

// Rota para inserir um novo filme
appRoutes.post('/new', async (req, res) => {
  try {
      const { titulo, sinopse, duracao, imagem, dataLancamento } = req.body;
      if (!titulo || !sinopse || !duracao || !imagem || !dataLancamento) {
          return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Decodifica a imagem base64 para binário
      const imagemBinario = Buffer.from(imagem, 'base64');

      const query = 'INSERT INTO `movies` (titulo, sinopse, duracao, imagem, dataLancamento) VALUES (?, ?, ?, ?, ?)';
      const values = [titulo, sinopse, duracao, imagemBinario, dataLancamento];

      const [result] = db.query(query, values);

      res.status(201).json({ message: 'Filme inserido com sucesso' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
  }
});

