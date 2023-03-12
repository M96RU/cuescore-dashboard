import {Component, Input, OnInit} from '@angular/core';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Tournament} from 'src/app/model/tournament';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  @Input()
  data: IntegrationData | undefined;

  selectedTournament: Tournament | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  updateTournament($event: any) {
    console.log('event:', $event);
  }

  selectTournament(tournament: Tournament) {
    this.selectedTournament = tournament;
  }
}
