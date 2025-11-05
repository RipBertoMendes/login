const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const dbFilePath = path.join(__dirname, 'db.json');


app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


const readUsers = () => {
  const data = fs.readFileSync(dbFilePath);
  return JSON.parse(data).users;
};

const writeUsers = (users) => {
  fs.writeFileSync(dbFilePath, JSON.stringify({ users }, null, 2));
};

// --- Configuração para Upload de Arquivos ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });



// --- Rotas da API ---

app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});


app.post('/users', (req, res) => {
  const users = readUsers();
  const newUser = { id: uuidv4(), ...req.body };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});


app.put('/users/:id', upload.single('fotoPerfil'), (req, res) => {
  const users = readUsers();
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }


  const updatedData = req.body;

  if (req.file) {
    updatedData.fotoPerfilUrl = req.file.filename;
  }

  users[userIndex] = { ...users[userIndex], ...updatedData };
  
  writeUsers(users);

  res.json(users[userIndex]);
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
