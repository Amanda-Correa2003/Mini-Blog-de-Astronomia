const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar ao Banco de Dados SQLite (apagando o antigo para recriar com o novo tema)
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('🌌 Conectado ao banco de dados SQLite (Astronomia).');
    initDb();
  }
});

// Criar tabelas e popular dados espaciais
function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER,
      email TEXT NOT NULL,
      body TEXT NOT NULL,
      FOREIGN KEY(postId) REFERENCES posts(id)
    )`);

    // Limpar dados antigos para atualizar o tema (opcional, mas garante que os posts novos entrem)
    db.run(`DELETE FROM posts`);
    db.run(`DELETE FROM comments`);

    const postsEspaciais = [
      ["O que tem no centro de um buraco negro?", "No centro de um buraco negro existe a chamada singularidade, um ponto onde a matéria é esmagada em uma densidade infinita e as leis da física que conhecemos deixam de funcionar."],
      ["Como os astronautas dormem na Estação Espacial?", "Como estão em microgravidade, os astronautas precisam se prender em sacos de dormir fixados nas paredes das cabines para não flutuarem e baterem em equipamentos durante a noite."],
      ["A busca por exoplanetas habitáveis", "Cientistas usam telescópios potentes como o James Webb para caçar planetas fora do nosso sistema solar que estejam na 'Zona Goldilocks' — nem muito quentes, nem muito frios, onde pode existir água líquida."],
      ["Os mistérios das luas de Júpiter", "Europa, uma das luas de Júpiter, possui um vasto oceano subterrâneo de água salgada escondido sob uma grossa camada de gelo, tornando-se um dos locais mais promissores para a busca de vida extraterrestre."],
      ["O legado do Telescópio James Webb", "Lançado para desvendar o universo profundo, o James Webb consegue capturar a luz das galáxias mais antigas formadas logo após o Big Bang com uma nitidez sem precedentes."],
      ["Por que Marte é vermelho?", "A cor avermelhada característica de Marte vem de uma grande quantidade de óxido de ferro (a famosa ferrugem) poeirenta que cobre a sua superfície e atmosfera."]
    ];

    const stmt = db.prepare("INSERT INTO posts (title, body) VALUES (?, ?)");
    postsEspaciais.forEach(p => stmt.run(p[0], p[1]));
    stmt.finalize();

    // Comentários espaciais
    db.run(`INSERT INTO comments (postId, email, body) VALUES 
      (1, 'astro.lucas@email.com', 'Incrível pensar que a física para ali'),
      (1, 'devalaya.p@email.com', 'Tudo mentira'),
      (2, 'carlinhosuzumaki@email.com', 'Sempre tive essa curiosidade sobre como eles dormem flutuando kkkk'),
      (3, 'helena.troia@email.com', 'Incrível!')`);
    
    console.log('🚀 Dados de astronomia semeados com sucesso!');
  });
}

// Rotas da API
app.get('/api/posts', (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  db.all("SELECT * FROM comments WHERE postId = ?", [postId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor estelar rodando em http://localhost:${PORT}`);
});

    