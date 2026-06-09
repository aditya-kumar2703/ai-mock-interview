const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = require('./src/models/User');
    const user = await User.findOne();
    if (!user) throw new Error('No user found');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 2. Create a dummy PDF file in memory
    const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
    // Just a tiny valid PDF buffer (a completely minimal empty PDF)
    const pdfBuffer = Buffer.from(
      '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%EOF\n'
    );
    fs.writeFileSync(dummyPdfPath, pdfBuffer);

    // 3. Make the request
    const form = new FormData();
    form.append('resume', fs.createReadStream(dummyPdfPath));

    const axios = require('axios');
    const response = await axios.post('http://localhost:5001/api/resume/analyze', form, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      }
    });

    console.log('STATUS:', response.status);
    console.log('RESPONSE:', JSON.stringify(response.data, null, 2));
    
  } catch (err) {
    if (err.response) {
      console.error('SCRIPT ERROR RESPONSE:', err.response.status, err.response.data);
    } else {
      console.error('SCRIPT ERROR:', err.message);
    }
  }
}

test();
