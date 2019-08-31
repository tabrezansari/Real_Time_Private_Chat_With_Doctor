import { Component, OnInit } from '@angular/core';
import { NgForm }  from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HandlerService } from '../handler.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
email:string;
password:string;
logData={};
constructor(private handleService: HandlerService,private router:Router) { }
  login(loginForm: NgForm) {
    this.logData={
       email:loginForm.value.email,
       password:loginForm.value.password};

    this.handleService.login(this.logData).subscribe(
      (response)=>
      {
        if(response.message==1)
        {
          this.handleService.getlogin(response.token,response.group,response.name);  
          alert("signed in successfully");
         this.router.navigate(['/home']);

        }
        else{
          alert("oops failed to login")
        }
      }
    );

  }
  ngOnInit() {
    if(this.handleService.isLoggedIn()){
      this.router.navigate(['/home']);
    
    }
  }

}
