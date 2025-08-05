const express = require('express');
const router = express.Router();
const doctorService = require('../services/doctorService');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new doctor
router.post('/', async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a doctor
router.put('/:id', async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a doctor
router.delete('/:id', async (req, res) => {
  try {
    const changes = await doctorService.deleteDoctor(req.params.id);
    if (changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
