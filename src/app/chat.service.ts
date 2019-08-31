import * as io from 'socket.io-client';
import {BehaviorSubject,Observable  } from 'rxjs';

export class ChatService {
    private url = 'http://localhost:1001';
    private socket; 
     userId=localStorage.getItem("token");

     
    constructor() {
      if(localStorage.getItem("userMeta")){
      this.socket = io('localhost:1001');
      this.socket.emit('join',JSON.parse(localStorage.getItem("userMeta")));
      }
    }
    public sendMessage(message,toUser) {
      console.log("messges sending is:",message)
      console.log("message sending to patient :",toUser)
      this.socket.emit('new-message', {message:message,toUser:toUser});
  }
  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
            observer.next(message);
        });
    });
}

public getHistChat = () => {
  this.socket.emit('getmessages');

}
public getHistChatData = () => {
  return Observable.create((observer) => {
      this.socket.on('getmsgs', (succChat) => {
        console.log("succesffull chats data are:",succChat)
          observer.next(succChat);
      });
  });
}
public getReqCleared = () => {
  return Observable.create((observer) => {
      this.socket.on('clear_reqs', (reqs) => {
        console.log("clearging request for chat :",reqs)
          observer.next(reqs);
      });
  });
}
public getActiveUsers = () => {
  return Observable.create((observer) => {
      this.socket.on('active-users', (users) => {
        console.log("active users are:",users)
          observer.next(users);
      });
  });
}

public sendDoctorRequest=()=>{
  this.socket.emit('doctor-request',JSON.parse(localStorage.getItem("userMeta")));

}
public startChatPatient=(userId)=>{
  this.socket.emit('start_chat',userId);
 
}
public getChatRequest = () => {
  return Observable.create((observer) => {
      this.socket.on('chat_req', (req) => {
        console.log("req data:",req)
          observer.next(req);
      });
  });
}
public getChatStart = () => {
  return Observable.create((observer) => {
      this.socket.on('chat', (chat) => {
        console.log("starting chat with doctor:",chat)
          observer.next(chat);
      });
  });
}

}