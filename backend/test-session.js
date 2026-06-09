const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

async function checkSessions() {
  await mongoose.connect(process.env.MONGO_URI);
  const Session = require('./src/models/Session');
  
  const sessions = await Session.find().limit(5).sort({ createdAt: -1 });
  console.log(sessions.map(s => ({ score: s.score, feedback: s.feedback.substring(0, 50) })));

  process.exit();
}

checkSessions();
