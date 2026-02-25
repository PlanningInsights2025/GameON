const express = require('express');
const router = express.Router();
const { createDiscipline, listDisciplines, updateDiscipline, deleteDiscipline } = require('../controllers/disciplineController');
const { protect, admin } = require('../middleware/auth');

router.get('/', listDisciplines);
router.post('/', protect, admin, createDiscipline);
router.put('/:id', protect, admin, updateDiscipline);
router.delete('/:id', protect, admin, deleteDiscipline);

module.exports = router;
