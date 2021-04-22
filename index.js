require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const app = express();
const { router, dao } = require('./js/endpoints')
const port = process.env.PORT || 3000;
app.use(cors());
app.use('', router)

const server = app.listen(port, async (err) => {
    await dao.connect();
    if (err){
        console.log('ERROR!', err);
        return;
    }
    console.log(`Server is listening on ${port}`);
});

process.on('SIGINT', () => server.close(() => { dao.disconnect(); }));
process.on('SIGTERM', () => server.close(() => { dao.disconnect(); }));