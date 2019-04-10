import { Component, OnInit } from '@angular/core';

import { APIService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginName = '';
  password = '';
   
  constructor(private API: APIService) {
     
  }
  Login() {
  console.log("Login()")
  this.API.login(this.loginName, this.password)
   
  }
 
  ngOnInit() { }
}
