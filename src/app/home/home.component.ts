import { Component, OnInit } from '@angular/core';
import { HandlerService } from '../handler.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from '../chat.service';
import { ThrowStmt } from '@angular/compiler';
import * as _ from 'lodash';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string;
  messages = [];
  totalReq = [];
  activeUsers = null;
  chatFriend = null;
  succChat = null;
  isDoctor = null;
  AllChats = null;
  currentUser=null;
  constructor(private chatService: ChatService, private router: Router, private handleService: HandlerService) {

  }


  sendMessage(toUser) {
    this.chatService.sendMessage(this.message, toUser);
    this.message = '';
  }
  getChats(friendId) {
    this.chatFriend = { name: friendId }
    this.handleService
      .getAllChats(this.currentUser, friendId)
      .subscribe((chats) => {
        Array.prototype.push.apply(this.messages, chats);
      })
  }
  requstDoctor() {
    this.chatService.sendDoctorRequest();
  }

  ngOnInit() {

    if (!this.handleService.isLoggedIn()) {
      this.router.navigate(['']);

    }

    if (localStorage.getItem("userMeta")) {
      if(JSON.parse(localStorage.getItem("userMeta")).group==2){
        this.isDoctor = true;
  
      }
    
   

    if(localStorage.getItem("userMeta")){
      this.currentUser = JSON.parse(localStorage.getItem("userMeta")).userid;
  
    }

    //get all the sucess chat history



    //fire for socket to emit chat history the succesfull chats
    this.chatService.getHistChat();


    //get all succesful chat data from 
    this.handleService
      .getHistChatData(this.currentUser)
      .subscribe((succChat) => {
        this.succChat = succChat;
      })
    //get all the messages
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });


    //get chat start with doctor

    this.chatService
      .getChatStart()
      .subscribe((chatFriend) => {
        this.chatFriend = chatFriend;
      })

    //get all active user list
    this.chatService
      .getActiveUsers().
      subscribe((activeUsers: []) => {
        this.activeUsers = activeUsers;
      });
    // get chat requst from patient
    this.chatService
      .getChatRequest()
      .subscribe((totalReq) => {
        if (!_.find(this.totalReq, { userid: totalReq.userid })) {
          this.totalReq.push(totalReq);

        }
      });

    //on accept clear all the char request 
    this.chatService
      .getReqCleared()
      .subscribe((reqs) => {
        _.remove(this.totalReq, function (reqss) {
          return reqss.userid === reqs;
        })
      })
  }
}
  logout() {
    this.handleService.logout();
  }


  startChat(user) {
    this.chatFriend = user;
    this.chatService.startChatPatient(user.userid);


  }
}
