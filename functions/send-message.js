require('dotenv').config();
const nodemailer = require('nodemailer');

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

    // Define the success HTML page content
    const successPage = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Sent Successfully</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007bff;
            text-align: center;
          }
          p {
            color: #333;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Sent Successfully</h1>
          <p>Your message has been successfully sent.</p>
          <p>We will get back to you shortly.</p>
        </div>
      </body>
      </html>
    `;

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
