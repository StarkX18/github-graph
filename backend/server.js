const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/domains', require('./routes/domains'));
app.use('/api/graphs', require('./routes/graphs'));
app.use('/api/data', require('./routes/data'));

const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
