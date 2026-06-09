const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./src/models/User');
  const Interview = require('./src/models/Interview');
  const Session = require('./src/models/Session');

  const users = await User.find();
  console.log(`Found ${users.length} users:`);
  users.forEach(u => console.log(` - ID: ${u._id}, Email: ${u.email}`));

  const interviews = await Interview.find();
  console.log(`\nFound ${interviews.length} TOTAL interviews:`);
  for (const interview of interviews) {
    const sessions = await Session.find({ interviewId: interview._id });
    const scores = sessions.map(s => s.score);
    console.log(`- Interview ID: ${interview._id}, User: ${interview.userId}, Status: ${interview.status}, Sessions: ${sessions.length}, Scores: ${scores.join(', ')}`);
  }

  process.exit();
}

checkDB();
