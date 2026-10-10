
const express = require('express');
const path = require('path');
const app = require('./server.js');

if (!app) {
    console.error("Server.js did not export the app object.");
    process.exit(1);
}

const PORT = 3001;
app.listen(PORT, () => {
    console.log('Test server running on port ' + PORT);
});
