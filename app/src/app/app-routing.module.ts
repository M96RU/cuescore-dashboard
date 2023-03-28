import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from 'src/app/home/home.component';
import {MatchScoreboardComponent} from 'src/app/match-scoreboard/match-scoreboard.component';
import {MatchTimerComponent} from 'src/app/match-timer/match-timer.component';
import {TimerComponent} from 'src/app/timer/timer.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'timer', component: TimerComponent},
  {path: 'match/:id/scoreboard', component: MatchScoreboardComponent},
  {path: 'match/:id/timer', component: MatchTimerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
