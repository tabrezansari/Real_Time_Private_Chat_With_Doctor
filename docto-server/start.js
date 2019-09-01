require('express-async-errors');

const _ = require("lodash");
const auth = require("./routes/auth");
const chat = require("./routes/chat");
const chatR = require("./routes/chatRoute");

const bodyParser = require('body-parser');

const express = require('express');
const app = express();

const cors = require('cors')
var whitelist = ['http://localhost:4200','http://localhost:1001']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded(
  { 
    limit: '50mb', extended: true 
  }));

app.use(cors());

app.use(express.json()); //req.body
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
let Server = require('http').Server(app);

var activeUser=[];
var privateChat=[];
let io = require('socket.io')(Server)
io.on('connection', (socket) => {
  socket.on('join', function (data) {
    if(!_.find(activeUser, {userid:data.userid})) {
      data.socket_id=socket.id;
      activeUser.push(data);
      socket.join(data.userid); // We are using room of socket io

    }

    io.emit("active-users",activeUser);

  });
    socket.on('new-message', (chatFriend) => {
      var sender=_.find(activeUser,{socket_id:socket.id})

      chat.storeChat(sender.userid,chatFriend.toUser,chatFriend.message);
      io.to('private_chat').emit('new-message', {message:chatFriend.message,userid:chatFriend.toUser});

    });
    socket.on('getmessages', () => {
      var finder=_.find(activeUser,{socket_id:socket.id})


      var chats=chat.getSuccessChats(finder.userid);

      io.sockets.emit('getmsgs', chats);

    });
      socket.on('doctor-request',(user)=>{
        for(let idx in activeUser){
          if(activeUser[idx].group===2){
            socket.join("private_chat");
            io.sockets.in(activeUser[idx].userid).emit('chat_req', {userid:user.userid,name:user.name});
            
          }
        }

      });
      socket.on('start_chat',(userId)=>{
        var doctor=_.find(activeUser,{socket_id:socket.id})
        socket.join("private_chat");
        chat.storeSChat(userId,doctor.userid);
        io.sockets.emit("clear_reqs",userId)
        io.sockets.in(userId).emit('chat', doctor);

      })

    socket.on('disconnect', function() {
      for(let idx in activeUser){
        if(activeUser[idx].socket_id===socket.id){
          activeUser.splice(idx,1);
        }
      }
      io.emit("active-users",activeUser);

    });
});


app.use(express.static('public'));



app.get('/', (req,res) => {
  res.send("Hello World");
});


app.use('/api/chat', chatR);
app.use('/api/auth', auth);


const port = 1001;
Server.listen(port, () => {console.log(`Listening app on port ${port}...`)})