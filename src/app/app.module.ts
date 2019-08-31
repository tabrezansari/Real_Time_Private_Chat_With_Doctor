import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgForm }  from '@angular/forms';
import swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule}  from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ChatService } from './chat.service';

const routelinks=[
  {path:'',component:LoginComponent},  
  {path:'home',component:HomeComponent}, 
  
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routelinks),
    FormsModule,
    HttpClientModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
