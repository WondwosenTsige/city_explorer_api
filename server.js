
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;
app.listen(PORT);





// Add error handling and start server
app.use('*', (request, response) => {
    response.status(404).send('The route you are looking for has been disconnected, We hope you have a nice day');
  });