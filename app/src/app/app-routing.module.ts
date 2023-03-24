import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from 'src/app/home/home.component';
import {MatchScoreboardComponent} from 'src/app/match-scoreboard/match-scoreboard.component';
import {TimerComponent} from 'src/app/timer/timer.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'timer', component: TimerComponent},
  {path: 'match/:id', component: MatchScoreboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
