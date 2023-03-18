import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Tournament} from 'src/app/model/tournament';
import {TournamentService} from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @Output()
  launchIntegration = new EventEmitter<boolean>();

  @Output()
  tournament = new EventEmitter<Tournament>();

  @Input()
  data: IntegrationData | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private tournamentService: TournamentService
  ) {
  }

  ngOnInit(): void {
  }

  selectTournament(tournament: Tournament): void {
    this.tournament.emit(tournament);
  }

  addTournament(inputValue: string): void {
    const value = (inputValue || '').trim();

    this.tournamentService.getCuescoreTournament(value).subscribe({
      next: response => {
        if (response.tournamentId) {
          this.tournamentService.addTournamentId(response.tournamentId);
          this.launchIntegration.emit(true);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  remove(tournament: Tournament) {
    this.tournamentService.removeTournamentId(tournament.id);
    this.launchIntegration.emit(true);
  }

  openTournament(tournament: Tournament) {
    window.open(tournament.url, tournament.name);
  }
}
