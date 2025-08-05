const express = require('express');
const router = express.Router();
const shiftService = require('../services/shiftService');

// Get all shift columns
router.get('/columns', async (req, res) => {
  try {
    const shiftColumns = await shiftService.getAllShiftColumns();
    res.json(shiftColumns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific shift column by ID
router.get('/columns/:id', async (req, res) => {
  try {
    const shiftColumn = await shiftService.getShiftColumnById(req.params.id);
    if (shiftColumn) {
      res.json(shiftColumn);
    } else {
      res.status(404).json({ error: 'Shift column not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new shift column
router.post('/columns', async (req, res) => {
  try {
    const shiftColumn = await shiftService.createShiftColumn(req.body);
    res.status(201).json(shiftColumn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a shift column
router.put('/columns/:id', async (req, res) => {
  try {
    const shiftColumn = await shiftService.updateShiftColumn(req.params.id, req.body);
    if (shiftColumn) {
      res.json(shiftColumn);
    } else {
      res.status(404).json({ error: 'Shift column not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a shift column
router.delete('/columns/:id', async (req, res) => {
  try {
    // First delete all assignments for this shift
    await shiftService.deleteAllAssignmentsForShift(req.params.id);
    
    // Then delete the shift column
    const changes = await shiftService.deleteShiftColumn(req.params.id);
    if (changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Shift column not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all shift assignments
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await shiftService.getAllShiftAssignments();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assignments by date range
router.get('/assignments/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
    }
    
    const assignments = await shiftService.getAssignmentsByDateRange(startDate, endDate);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assignment by date and shift
router.get('/assignments/:date/:shiftId', async (req, res) => {
  try {
    const { date, shiftId } = req.params;
    const assignment = await shiftService.getAssignmentByDateAndShift(date, shiftId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update a shift assignment
router.post('/assignments', async (req, res) => {
  try {
    const assignment = await shiftService.createShiftAssignment(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a shift assignment
router.delete('/assignments/:date/:shiftId', async (req, res) => {
  try {
    const { date, shiftId } = req.params;
    const changes = await shiftService.deleteShiftAssignment(date, shiftId);
    if (changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
