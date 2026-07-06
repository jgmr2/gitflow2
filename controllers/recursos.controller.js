const Recurso = require('../models/Recurso');

async function getRecursos(req, res) {
  const recursos = await Recurso.find();
  res.json(recursos);
}

async function getRecursoById(req, res) {
  const recurso = await Recurso.findById(req.params.id);

  if (!recurso) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.json(recurso);
}

async function createRecurso(req, res) {
  const recurso = await Recurso.create({ nombre: req.body.nombre });
  res.status(201).json(recurso);
}

async function updateRecurso(req, res) {
  const recurso = await Recurso.findByIdAndUpdate(
    req.params.id,
    { nombre: req.body.nombre },
    { new: true, runValidators: true }
  );

  if (!recurso) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.json(recurso);
}

async function deleteRecurso(req, res) {
  const recurso = await Recurso.findByIdAndDelete(req.params.id);

  if (!recurso) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.status(204).send();
}

module.exports = { getRecursos, getRecursoById, createRecurso, updateRecurso, deleteRecurso };
