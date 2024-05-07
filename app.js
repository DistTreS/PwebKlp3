const express = require('express');
const app = express();
const port = 3000; 

app.set('view engine', 'ejs');


app.get('/',(req, res) => {
    res.render('index');
});


//app.get('/', (req, res) => {
//    res.send('Hello World!');
//});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
