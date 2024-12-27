require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI}= require('./keys')



mongoose.connect(MONGOURI)
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("error in database", err);
    });

    app.use(cors({
        origin: ['https://social-media-app-3h5q.vercel.app', 'https://social-media-app-3h5q-git-main-sandeeps-projects-22864139.vercel.app'], 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
        credentials: true, // Allow cookies if needed
    }));

require('./models/user')
require('./models/post')

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');




app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, ()=>{
    console.log("sever is running on" ,PORT)
})