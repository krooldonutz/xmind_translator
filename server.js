const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })
  const { spawn, exec } = require('child_process');
const translate = require('./translate.js');

const app = express();

app.post('/process_file', upload.single('file'), (req, res) => {
    const apiKey = req.body.API_KEY
    const language = req.body.language
    // req.file is the 'file' file
    // It's information will be located in req.file
    // File is now in './uploads/' directory
    let output = '';
    // Call Python script here
    const python = spawn('./env/bin/python3', ['./translate.py', req.file.path.toString(), apiKey, language]);
    console.log(req.file.path.toString());
    python.stdout.on('data', (data) => {
        output += data.toString();
    });
    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        // Rebuild Xmind file
        const fileName = translate.main(output, language);
        console.log(fileName)
        setTimeout(() => {
            res.download(fileName, (err) => {
                if (err) {
                    console.error(`Error: ${err}`);
                    console.error(`Failed to download file: ${fileName}`);
                } else {
                    fs.unlink(fileName, (err) => {
                        if (err) {
                            console.error(`Failed to delete file: ${err}`);
                        } else {
                            console.log(`File deleted: ${fileName}`);
                        }
                    });
                }
            });
        }, 3000);
    });
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Create a virtual environment
exec('python3 -m venv env', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error creating virtual environment: ${err}`);
        return;
    }

    // Activate the virtual environment and install deepl
    exec('source env/bin/activate && pip3 install deepl && pip3 install xmindparser', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error installing deepl: ${err}`);
            return;
        }

        // Run the Python script within the virtual environment
        exec('source env/bin/activate', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error running script: ${err}`);
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            // Start the server
                app.listen(3000, () => {
                    console.log('Server started on port 3000');
                });
        });
    });
});