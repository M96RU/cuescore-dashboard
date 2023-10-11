import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IntegrationService} from 'src/app/integration/integration-service';
import {MatchesComponent} from 'src/app/matches/matches.component';
import {TournamentService} from 'src/app/tournament/tournament.service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChronoComponent} from './chrono/chrono.component';
import {MatchComponent} from './match/match.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {TableComponent} from './table/table.component';
import {TournamentComponent} from './tournament/tournament.component';
import { PlayerComponent } from './player/player.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { TimerComponent } from './timer/timer.component';
import { HomeComponent } from './home/home.component';
import { MatchScoreboardComponent } from 'src/app/match-scoreboard/match-scoreboard.component';
import { MatchTimerComponent } from './match-timer/match-timer.component';
import { TimerCountdownComponent } from './timer-countdown/timer-countdown.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    TournamentComponent,
    TableComponent,
    ChronoComponent,
    MatchComponent,
    ScheduleComponent,
    PlayerComponent,
    MatchesComponent,
    PlayerDetailComponent,
    TimerComponent,
    HomeComponent,
    MatchScoreboardComponent,
    MatchTimerComponent,
    TimerCountdownComponent
  ],
  imports: [
    /**
     * Generated by cli
     */
    AppRoutingModule,

    /**
     * Angular modules
     */
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,

    /**
     * Material modules
     */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    FormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  providers: [
    IntegrationService,
    TournamentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
