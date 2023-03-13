import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';
import {Tournament} from 'src/app/model/tournament';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit, OnChanges {

  @Input()
  data: IntegrationData | undefined;

  @Input()
  tournament: Tournament | undefined;

  matches: Match[] = [];

  constructor() { }

  displayedColumns: string[] = ['order', 'round', 'playerA', 'playerAscore', 'raceTo', 'playerBscore', 'playerB', 'start', 'table'];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      if (this.tournament) {
        this.matches = this.data.matches.filter(match => match.tournamentId === this.tournament?.id);
      } else {
        this.matches = this.data.matches;
      }
    }
  }

}
