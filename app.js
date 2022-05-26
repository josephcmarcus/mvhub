const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(PORT || 3000, () => console.log(`🚀 Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/thrivecart', (req, res) => {
    console.log(req.body);
    res.status(204).send('hola');
});

app.post('/thrivecart', (req, res) => {
    console.log(
        `${req.body.event}`
    );
    res.status(204).send('hola');
});