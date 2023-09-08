const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));

app.use(express.static('public'));

app.post('/send-email', upload.array('image', 5), async (req, res) => {
    try {
        const { name, email, mic, crt, patenteTractor, semiRemolque } = req.body;
        const imageDataUrls = req.files.map(file => file.buffer.toString('base64'));

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Fotos Capturadas',
            text: `
                Nombre y Apellido: ${name}
                MIC BR: ${mic}
                CRT BR: ${crt}
                Patente Tractor: ${patenteTractor}
                Semirremolque: ${semiRemolque}
                Email: ${email}
                `,
            attachments: []
        };

        for (let i = 0; i < imageDataUrls.length; i++) {
            mailOptions.attachments.push({
                filename: `photo_${i + 1}.jpg`,
                content: imageDataUrls[i],
                encoding: 'base64',
            });
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado con exito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el correo electronico' });
    }
});

const smtpPort = 587;
app.listen(smtpPort, () => {
    console.log(`Servidor SMTP iniciado en el puerto ${smtpPort}`);
});

const webPort = 3000;

app.use(express.static('public'));

app.listen(webPort, () => {
    console.log(`Servidor web iniciado en el puerto ${webPort}`);
});
