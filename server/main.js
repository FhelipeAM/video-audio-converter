const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const fs = require('fs');
const fs2 = require('fs').promises;

const app = express();
const upload = multer({ dest: 'uploads/' });

// const fs = FileSystem();
app.use(express.static('converted'));

app.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const commandToExecute = `ffmpeg -i ${filePath} converted/${req.file.filename}.mp3`;

    exec(commandToExecute, async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error executing command: ${stderr}`);
        }

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
            
        const cFilePath = path.join(__dirname, 'converted', `${req.file.filename}.mp3`); 
        
        let file = fs.readFile(cFilePath, 'binary', async (err, dat) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.setHeader('Content-Length', dat.length);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', `attachment; ${req.file.filename}.mp3`);
            res.write(dat, 'binary', (bin2, bin3) => {});
            res.end();
        });
    });

});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});