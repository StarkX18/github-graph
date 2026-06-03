const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/domains', require('./routes/domains'));
app.use('/api/graphs', require('./routes/graphs'));
app.use('/api/data', require('./routes/data'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
