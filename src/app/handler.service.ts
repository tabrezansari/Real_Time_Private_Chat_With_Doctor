import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { variable } from '../../node_modules/@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  totallen: number;
  userMeta = {};
  constructor(private http: HttpClient, private router: Router) { }

  /* persistant login code start*/





  getlogin(token: string, group: number, name: string): void {
    this.userMeta = {
      userid: token,
      group: group,
      name: name,
      socket_id: ""
    }
    localStorage.setItem("userMeta", JSON.stringify(this.userMeta));
  }


  /* persistant login code end*/




  //user login 
  login(logData) {
    return this.http.post<{ message: number, token: string, group: number, name: string }>("http://localhost:1001/api/auth", logData);

  }

  logout(): void {

    localStorage.clear();
    this.router.navigate(['/login']);

  }
  getHistChatData = (userid) => {
    return this.http.post<{ chats: [] }>("http://localhost:1001/api/chat/getList", { userid: userid });

  }
  getAllChats = (userid, friendId) => {
    return this.http.post<{ chats: [] }>("http://localhost:1001/api/chat/getAllChats", { userid: userid, friendid: friendId });

  }

  isLoggedIn(): boolean {
    if (localStorage.getItem("userMeta")) {
      return true;
    }
    else {
      return
      false;
    }
  }



}


