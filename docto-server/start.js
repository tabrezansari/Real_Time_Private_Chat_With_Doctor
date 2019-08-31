require('express-async-errors');

const _ = require("lodash");
const auth = require("./routes/auth");
const chat = require("./routes/chat");
// const project_categories = require("./routes/project_categories");
// const project_documents = require("./routes/project_documents");ß
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
    console.log("createing room for user:",data.userid)
    if(!_.find(activeUser, {userid:data.userid})) {
      data.socket_id=socket.id;
      activeUser.push(data);
      socket.join(data.userid); // We are using room of socket io

    }

    io.emit("active-users",activeUser);

  });
    console.log('user connected',socket.id);
    socket.on('new-message', (chatFriend) => {
      console.log("message data recv:",chatFriend);
      console.log('user' +socket.id+ 'sent message to "'+ chatFriend.toUser +'"');
      var sender=_.find(activeUser,{socket_id:socket.id})

      chat.storeChat(sender.userid,chatFriend.toUser,chatFriend.message);
      io.to('private_chat').emit('new-message', {message:chatFriend.message,userid:chatFriend.toUser});

    });
    socket.on('getmessages', () => {
      console.log("retrivng history chats")
      var finder=_.find(activeUser,{socket_id:socket.id})

      var chats=chat.getSuccessChats(finder.userid);

      io.sockets.emit('getmsgs', chats);

    });
      socket.on('doctor-request',(user)=>{
        console.log("calling to requ doctors")
        for(let idx in activeUser){
          if(activeUser[idx].group===2){
            console.log("sending request to :",activeUser[idx].name)
            socket.join("private_chat");
            io.sockets.in(activeUser[idx].userid).emit('chat_req', {userid:user.userid,name:user.name});
            
          }
        }

      });
      socket.on('start_chat',(userId)=>{
        var doctor=_.find(activeUser,{socket_id:socket.id})
        console.log("doctor starting chat with to :",doctor)
        socket.join("private_chat");
        io.sockets.emit("clear_reqs",userId)
        io.sockets.in(userId).emit('chat', doctor);

      })

    socket.on('disconnect', function() {
      console.log("user disconnect")
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

// app.use('/api/projects', projects);
// app.use('/api/categories', project_categories);
// app.use('/api/documents', project_documents);
// app.use('/api/users', users);
app.use('/api/auth', auth);

// app.use(error);

const port = 1001;
Server.listen(port, () => {console.log(`Listening app on port ${port}...`)})