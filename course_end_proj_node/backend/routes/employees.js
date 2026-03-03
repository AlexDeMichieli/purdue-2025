const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const dataFile = path.join(__dirname, '..', 'data', 'employees.json');

// --- helpers ---

function readEmployees() {
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw);
}

function writeEmployees(employees) {
  fs.writeFileSync(dataFile, JSON.stringify(employees, null, 2));
}

function validateEmployee(body) {
  const errors = [];
  const required = ['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'dateOfJoining'];

  for (const field of required) {
    if (!body[field] && body[field] !== 0) {
      errors.push(`${field} is required`);
    }
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('email must be a valid email address');
  }

  if (body.salary !== undefined && (typeof body.salary !== 'number' || body.salary < 0)) {
    errors.push('salary must be a positive number');
  }

  if (body.dateOfJoining && !/^\d{4}-\d{2}-\d{2}$/.test(body.dateOfJoining)) {
    errors.push('dateOfJoining must be in YYYY-MM-DD format');
  }

  return errors;
}

// --- routes ---

// GET /api/employees — list all
router.get('/', (req, res) => {
  try {
    const employees = readEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read employees' });
  }
});

// GET /api/employees/:id — get one
router.get('/:id', (req, res) => {
  try {
    const employees = readEmployees();
    const employee = employees.find((e) => e.id === req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read employees' });
  }
});

// POST /api/employees — create
router.post('/', (req, res) => {
  try {
    const errors = validateEmployee(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const employees = readEmployees();

    // check unique email
    if (employees.some((e) => e.email === req.body.email)) {
      return res.status(400).json({ errors: ['email already exists'] });
    }

    const newEmployee = {
      id: crypto.randomUUID(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      position: req.body.position,
      salary: req.body.salary,
      dateOfJoining: req.body.dateOfJoining,
    };

    employees.push(newEmployee);
    writeEmployees(employees);
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id — update
router.put('/:id', (req, res) => {
  try {
    const errors = validateEmployee(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const employees = readEmployees();
    const index = employees.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // check unique email (excluding current employee)
    if (employees.some((e) => e.email === req.body.email && e.id !== req.params.id)) {
      return res.status(400).json({ errors: ['email already exists'] });
    }

    employees[index] = {
      ...employees[index],
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      position: req.body.position,
      salary: req.body.salary,
      dateOfJoining: req.body.dateOfJoining,
    };

    writeEmployees(employees);
    res.json(employees[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id — delete
router.delete('/:id', (req, res) => {
  try {
    const employees = readEmployees();
    const index = employees.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const deleted = employees.splice(index, 1)[0];
    writeEmployees(employees);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
