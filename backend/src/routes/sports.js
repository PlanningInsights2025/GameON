const express = require('express');
const router = express.Router();
const { createSport, listSports, getSport, updateSport, deleteSport } = require('../controllers/sportController');
const { protect, admin } = require('../middleware/auth');

router.get('/', listSports);
router.get('/:id', getSport);
router.post('/', protect, admin, createSport);
router.put('/:id', protect, admin, updateSport);
router.delete('/:id', protect, admin, deleteSport);

module.exports = router;
