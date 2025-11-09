import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

const domain = "https://localhost:7249/"

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  constructor(public http : HttpClient) { }

  async getPublicScores(){

    let x = await lastValueFrom(this.http.get<any>(domain + "api/Scores/PublicScores"));
    console.log(x);

    return x;

  }


  async getPrivateScores(){

    let x = await lastValueFrom(this.http.get<any>(domain + "api/Scores/GetMyScores"));
    console.log(x);

    return x;

  }

  async changeScoreVisibility(id : number){

    let x = await lastValueFrom(this.http.put<any>(domain + "api/Scores/ChangeScoreVisibility/" + id, null));
    console.log(x);

    return x;

 }

 async postScore(timeInS : number, scoreVal : number){
    
  let scoreDTO = {
      TimeInSeconds : timeInS,
      ScoreValue : scoreVal
    };

    let x = await lastValueFrom(this.http.post<any>(domain + "api/Scores/PostScore", scoreDTO));
    console.log(x);

    return x;

 }

}
