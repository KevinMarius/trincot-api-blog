const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const State = require('./models/state');
const { fileUpload } = require('./helpers/fileUpload');
const HttpError = require('./models/http-error')
const fs = require('fs');
const path = require('path');

/*
State.estimatedDocumentCount((err, count) => {
    if(!err && count === 0) {
        new State({state: "IN_WRITING"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'IN_WRITING' to roles collection");
        });
        new State({state: "PUBLISHED"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'PUBLISHED' to roles collection");
        });
        new State({state: "ARCHIVED"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'ARCHIVED' to roles collection");
        });
        new State({state: "WAITING_VALIDATION"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'WAITING_VALIDATION' to roles collection");
        });
    }
})
*/
dotenv.config()

console.log(process.env.DB_PASSWORD)

//===================== db connect ==========================
mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@trincot.f6cyeqa.mongodb.net/?retryWrites=true&w=majority`)
.then(() => console.log("db connected", bcrypt.hashSync("Password0000", 10)))

mongoose.connection.on(("error"), err => {
    //console.log(`db connection error: ${err.message}`)
})

const app = express()

//======== import routes =================
const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute');
const commentRoutes = require('./routes/commentRoute');
const likeRoutes = require('./routes/likeRoute');
const roleRoutes = require('./routes/roleRoute');

//===== middleware ========
app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');

    next();
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/role", roleRoutes);

app.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err)
        })
    }
    if(res.headerSent) (
        next(error)
    )
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred"})
})

//app.use(expressValidator());

const port = process.env.PORT || 3500

app.listen(port, () => {
    console.log('vous etes connecte sur le port: ', port)
})
