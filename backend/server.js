// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const compositionRoutes = require('./routes/composition');
const progressRoutes = require('./routes/progress');
const streakRoutes = require('./routes/streak');
const leaderboardRoutes = require('./routes/leaderboard');
const onDemandTestRoutes = require('./routes/onDemandTest');

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/composition', compositionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/tests', onDemandTestRoutes);

app.get('/api/', (req, res) => res.send('English Tutor API running...'));

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
