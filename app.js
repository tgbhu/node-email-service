// import dependencies
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Health route
app.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  }
  res.status(200).send(data)
})

// Send email route
app.post('/email', (req, res) => {
  const { name, email, message } = req.body

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Port for SMTP (usually 465)
    secure: true, // Usually true if connecting to port 465
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  })

  // Email data
  const mailOptions = {
    to: process.env.RECEIVER_EMAIL,
    from: process.env.FROM_TEXT,
    subject: 'email subject',
    html: `
        Név:${name} <br />
        Email cim:${email} <br />
        Üzenet:${message} <br />
    `,
  }

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send('Error sending email')
    } else {
      res.send('Email sent successfully')
    }
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`)
})
