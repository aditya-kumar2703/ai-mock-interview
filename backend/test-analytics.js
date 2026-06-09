const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

async function checkAnalytics() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./src/models/User');
  const user = await User.findOne();
  
  if (!user) {
    console.log("No user found");
    process.exit();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const axios = require('axios');
  
  try {
    const res = await axios.get('http://localhost:5001/api/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("ERR:", err.response ? err.response.data : err);
  }
  process.exit();
}

checkAnalytics();
