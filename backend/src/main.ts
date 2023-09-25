// import needed libraries
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import routes from './routes';

// get express application
const app = express();
// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// applying the routes to the basepath '/api'
app.use('/api', routes);
// define app port
const port = process.env.PORT || 3000;
// starts the server
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})