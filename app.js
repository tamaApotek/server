    ////SET dev: NODE_ENV=development nodemon app.js
    if(process.env.NODE_ENV == 'development'){
        require('dotenv').config()
    }
    
    const express = require('express')
    const app = express()
    var http = require('http').createServer(app);
    var io = require('socket.io')(http);
    const cors = require('cors')
    const mongoose = require('mongoose')
    const socketio = require('./helper/socket');
    const redis = require('socket.io-redis');
    io.adapter(redis({ host: 'localhost', port: 6379 }));
    app.use(cors())
    mongoose.connect(process.env.ATLAS_CONNECT, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('connected to MongoDB')
    })
    .catch(err =>{
        console.log('failed to connect to MongoDB', err)
    })
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))   
    
    const router = require('./routes')
    const PORT = process.env.PORT
    
    const errorHandler = require('./middleware/errorHandler')

    // io.on('connection', socketio);
    
    app.use('/', router)
    app.use(errorHandler)
    
    // app.listen(PORT, function(){
    //     console.log('connected to port', PORT)
    // })
    http.listen(PORT, function(){
        console.log('listening on ', PORT);
    });
    module.exports = io

    


