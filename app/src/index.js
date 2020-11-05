const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Listening at localhost:${port}`);
});