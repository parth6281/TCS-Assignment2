const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path')
const { getWeather } = require('./api/routes');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'logs', 'access.log')) }));;

app.get('/', getWeather);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found!'
    })
})

app.listen(port, () => {
    console.info(`Server listening on port: ${port}.`);
});
