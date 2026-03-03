const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// routes
app.use('/api/employees', employeeRoutes);

// health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'EMS API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
