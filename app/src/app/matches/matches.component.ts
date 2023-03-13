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

  @Input()
  tournament: Tournament | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
