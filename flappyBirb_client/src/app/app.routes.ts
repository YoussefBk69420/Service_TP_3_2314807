import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { ScoreComponent } from './score/score.component';

export const routes: Routes = [
    {path:"", redirectTo:"/play", pathMatch:"full"},
    {path:"login", component:LoginComponent},
    {path:"play", component:PlayComponent},
    {path:"scores", component:ScoreComponent}
];
