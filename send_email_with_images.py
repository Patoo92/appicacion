import os

# Cargar las variables de entorno
smtp_username = os.environ.get('EMAIL_USER')
smtp_password = os.environ.get('EMAIL_PASS')

# Comprobar si las variables de entorno están definidas
if smtp_username is None or smtp_password is None:
    raise ValueError("Las variables de entorno EMAIL_USER y EMAIL_PASS deben estar definidas.")

# Resto del código de configuración del correo electrónico y envío

const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const app = express();

app.use(bodyParser.json());

app.post('/send-email-with-images', (req, res) => {
    const { name, email, mic, crt, patenteTractor, semiRemolque, imagePaths } = req.body;

    // Llama al script Python para enviar el correo electrónico con imágenes adjuntas
    const pythonProcess = spawn('python', ['send_email_with_images.py', name, email, mic, crt, patenteTractor, semiRemolque, ...imagePaths]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        if (code === 0) {
            res.status(200).json({ message: 'Correo enviado con éxito' });
        } else {
            res.status(500).json({ message: 'Error al enviar el correo electrónico' });
        }
    });
});

const webPort = 3000;
app.listen(webPort, () => {
    console.log(`Servidor web iniciado en el puerto ${webPort}`);
});
