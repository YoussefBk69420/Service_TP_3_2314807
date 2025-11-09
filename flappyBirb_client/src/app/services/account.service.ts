import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

const domain = "https://localhost:7249/"

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public http: HttpClient) { }

  async register(username : string, email : string, password : string, passwordConfirm : string) : Promise<void> {

    let registerDTO = {
        Username : username, 
        Email : email, 
        Password : password, 
        PasswordConfirm : passwordConfirm
    };

    let x = await lastValueFrom(this.http.post<any>(domain + "api/Users/Register", registerDTO));
    console.log(x);
    
  }

  async login(username : string, password : string) : Promise<boolean>{

    let loginDTO =  {
        Username : username,
        Password : password
    };

    try {
      let x = await lastValueFrom(this.http.post<any>(domain + "api/Users/Login", loginDTO));
      console.log(x);

      // 🔑 Très important de stocker le token quelque part pour pouvoir l'utiliser dans les futures requêtes !
      localStorage.setItem("token", x.token);
      return true;
    }
    catch (error) {
      console.log("Login failed");
      return false;
    }
  }
}
