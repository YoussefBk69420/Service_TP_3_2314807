import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  hide = true;

  registerUsername : string = "";
  registerEmail : string = "";
  registerPassword : string = "";
  registerPasswordConfirm : string = "";

  loginUsername : string = "";
  loginPassword : string = "";

  constructor(public accountService : AccountService, public route : Router) { }

  ngOnInit() {
  }

  async login(){
    let x = await this.accountService.login(this.loginUsername, this.loginPassword)

    if(x) {
      // Redirection si la connexion a réussi :
      this.route.navigate(["/play"]);
    } 
  }

  async register(){
    await this.accountService.register(this.registerUsername, this.registerEmail, this.registerPassword, this.registerPasswordConfirm);
  }
  
}
