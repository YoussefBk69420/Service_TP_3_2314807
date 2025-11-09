import { Component, OnInit } from '@angular/core';
import { Game } from './gameLogic/game';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { ScoresService } from '../services/scores.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit{

  game : Game | null = null;
  scoreSent : boolean = false;


  score = 0
  time = 0

  constructor(public scoresService : ScoresService){}

  ngOnDestroy(): void {
    // Ceci est crotté mais ne le retirez pas sinon le jeu bug.
    location.reload();
  }

  ngOnInit() {
    this.game = new Game();
  }

  replay(){
    if(this.game == null) return;
    this.game.prepareGame();
    this.scoreSent = false;
  }

  sendScore(){
    if(this.scoreSent) return;

    this.scoreSent = true;
    
    // ██ Appeler une requête pour envoyer le score du joueur ██
    // Le score est dans sessionStorage.getItem("score")
    // Le temps est dans sessionStorage.getItem("time")
    // La date sera choisie par le serveur


    let timeInStringData = sessionStorage.getItem("time");
    let scoreValStringData = sessionStorage.getItem("score");


    if(scoreValStringData != null) {
      this.score = JSON.parse(scoreValStringData);
    }


    if(timeInStringData != null) {
      this.time = JSON.parse(timeInStringData);
    }

    
    this.scoresService.postScore(this.time, this.score);
  }


}
