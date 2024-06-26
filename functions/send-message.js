require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const NODEKEY = process.env.NODE_KEY;
const NODEPASS = process.env.NODE_PASS;

function convertQueryStringToJson(queryString) {
  // Split the query string into key-value pairs
  const pairs = queryString.split('&');

  // Initialize an empty object to store the result
  const result = {};

  // Loop through each key-value pair
  pairs.forEach(pair => {
    // Split each pair into key and value
    const [key, value] = pair.split('=');

    // Decode the URL-encoded value
    const decodedValue = decodeURIComponent(value);

    // Assign the key-value pair to the result object
    result[key] = decodedValue;
  });

  return result;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    let data = convertQueryStringToJson(event.body);
    console.log(data);
    const { name, email, message } = data;
    console.log('Received data:', { name, email, message });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "jayachandrands0120@gmail.com",
        pass: "qjzv wrsj tlet aces",
      },
    });

    let mailOptions = {
      from: email,
      to: 'jayachandrands0120@gmail.com',
      subject: 'New Contact Form Message',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    // Read the success.html file
    const successPage = fs.readFileSync(path.join(__dirname, '../public/success.html'), 'utf8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: successPage,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email. Please try again later.' }),
    };
  }
};
