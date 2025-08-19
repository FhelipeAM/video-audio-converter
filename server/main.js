//includes
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const fs = require('fs');

const app = express();

//sets the folder to lay the client's (temporary) uploaded file
const upload = multer({ dest: 'uploads/' });

//opens an endpoint on server root to receive an upload of a file
app.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    //get where the file got stored
    const filePath = req.file.path;
    // using ffmpeg to convert the file into an mp3 (could be dynamically set via variable)
    const commandToExecute = `ffmpeg -i ${filePath} converted/${req.file.filename}.mp3`;

    //runs the command
    exec(commandToExecute, async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error executing command: ${stderr}`);
        }

        //deletes the temporary file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        
        //gets the converted file path
        const cFilePath = path.join(__dirname, 'converted', `${req.file.filename}.mp3`); 
        
        //reads the binary data stored in it
        let file = fs.readFile(cFilePath, 'binary', (err, dat) => {
            if (err) {
                console.log(err);
                return;
            }
            
            //sends it to the client
            res.setHeader('Content-Length', dat.length);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', `attachment; ${req.file.filename}.mp3`);
            res.write(dat, 'binary', () => {});
            res.end();
        });
    });

});

//opens the server port
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});