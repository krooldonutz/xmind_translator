1. Make sure you have a DeepL API key. You can get it by creating an account on the DeepL website and subscribing to their API plan.

2. Navigate to the project directory in your terminal.

3. Install the required Node.js packages. These are express, multer, and child_process. You can install them using npm:

```bash
npm install express multer child_process
```

4. Run the server.js file with Node.js:

```bash
node server.js
```

The server should now be running on port 3000. When you access the file upload form and submit a file, make sure to enter your DeepL API key in the API_KEY field.

Please note that this server also interacts with a Python environment and runs a Python script. You need to have Python installed and the required Python packages (deepl and xmindparser) installed in the virtual environment that the server script creates. If you don't have Python installed, you can download it from the official Python website.