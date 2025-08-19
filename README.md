# Video to MP3 Converter API
A simple Node.js server that converts uploaded video files to MP3 audio. It provides both a RESTful API endpoint for programmatic access and a basic web UI for manual conversions.

## Usage:

Install [ffmpeg](https://ffmpeg.org/download.html), [Node.js](https://nodejs.org/en/download), [npm](https://www.npmjs.com/)

Open the server folder in the terminal using ```cd server```

Execute ```npm install``` to get all dependencies 

Run ```npm start``` to initialize the server

## Note:

I've included a page in '/ui/' to show how a file should be uploaded via web. But you can also use curl to upload files.
```curl -X POST -F "file=@**file_path**" http://**server_ip**:**port** -o **filename**.mp3```