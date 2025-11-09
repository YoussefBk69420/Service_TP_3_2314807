import { Component } from '@angular/core';
import { Score } from '../models/score';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { Round00Pipe } from '../pipes/round-00.pipe';
import { ScoresService } from '../services/scores.service';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [MaterialModule, CommonModule, Round00Pipe],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css'
})
export class ScoreComponent {

  myScores : Score[] = [];
  publicScores : Score[] = [];

  constructor(public scoresService : ScoresService) { }

  async ngOnInit() {

    this.publicScores = await this.scoresService.getPublicScores();
    this.myScores = await this.scoresService.getPrivateScores();


  }

  async changeScoreVisibility(score : Score){


    await this.scoresService.changeScoreVisibility(score.id);

    await this.ngOnInit();
  }

}
