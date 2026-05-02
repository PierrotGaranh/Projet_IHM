import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Bonjour depuis backend Express !' });
});

app.post('/api/echo', (req, res) => {
  res.json({ echoed: req.body });
});

// Materiel CRUD (en mémoire, peut être étendu en JSON ou BD)
const materiels = [];
const ETATS_VALIDES = ['Mauvais', 'Bon', 'Abime'];

app.get('/api/materiel', (req, res) => {
  res.json(materiels);
});

app.post('/api/materiel', (req, res) => {
  const { numMateriel, design, etat, qualite } = req.body || {};

  if (!numMateriel || !design || !etat || !qualite) {
    return res.status(400).json({ message: 'Champs requis: numMateriel, design, etat, qualite' });
  }

  if (!ETATS_VALIDES.includes(etat)) {
    return res.status(400).json({ message: `etat doit être l'un de: ${ETATS_VALIDES.join(', ')}` });
  }

  if (materiels.some((m) => m.numMateriel === numMateriel)) {
    return res.status(409).json({ message: `numMateriel ${numMateriel} existe déjà` });
  }

  const newItem = { numMateriel, design, etat, qualite };
  materiels.push(newItem);

  res.status(201).json(newItem);
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend Express en écoute sur http://localhost:${port}`);
});
