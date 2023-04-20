const express = require('express')
const next = require('next');
const bodyParser = require('body-parser');
const cors = require('cors')

const userRouter = require('./routes/userRouter')

require('./database/dbConnection')

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {

    const app = express();

    // Use middleware
    app.use(express.static('uploads'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors({
        origin: "http://192.168.1.22:8080"
    }));

    // User entity related API routes.
    app.use("/backend/api/", userRouter);

    // Handle all other routes
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    app.listen(3000, err => {
        if (err) throw err;
        console.log('Server listening on http://localhost:3000');
      });
})
