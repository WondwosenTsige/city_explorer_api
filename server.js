
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT);





app.listen(PORT, () => console.log(`app is listening at ${PORT}`));

// Add error handling and start server
app.use('*', (request, response) => {
    response.status(404).send('The route you are looking for has been disconnected, We hope you have a nice day');
  });