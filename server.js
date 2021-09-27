// const path = require('path');
// const cors = require('cors')
// const http = require('http');
// const express = require('express');
// const socketio= require('socket.io');
const {formatMessage} = require('./utils/messages');
const { userJoin , getCurrentUser ,getRoomUser ,userLeave } = require('./utils/users');


// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
 
// //set static folder
// app.use(express.static(path.join(__dirname,'./public')));
// app.use(cors());


// for seperate server and client
const io = require('socket.io')(process.env.PORT || 8000 , {

    cors: {

      origin: '*',

    }

  });


const botName = 'Chat-Bot';

//

//Run when client connects
io.on('connection',socket =>{
   
    socket.on('joinRoom',({username,room}) => {
        const user = userJoin(socket.id ,username ,room );
        socket.join(user.room);
        //Welcome current user

    socket.emit('message', formatMessage(botName,'Welcome to Hiku!'));

    //Broadcast when userr connects to a specific room using to(user.room)
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

         // Send User info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUser(user.room)
            });

    });

    //Listeninf of chat message
    socket.on('chatMessage',msg =>{
        const user = getCurrentUser(socket.id);

        //oiriginal code
        socket.to(user.room).emit('recieve',formatMessage(user.username , msg));
       

    });

    // io.emit//On client disconnect
    socket.on('disconnect',()=>{

        const user = userLeave(socket.id);
        if (user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

               // Send User info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUser(user.room)
    });
        }
            
    });

   

    
});

// const PORT =  process.env.PORT || 3000 ;

// server.listen(PORT,()=> console.log(`Server running at Port ${PORT}`));
