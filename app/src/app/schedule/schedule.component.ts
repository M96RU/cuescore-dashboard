import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnChanges {

  @Input()
  data: IntegrationData | undefined;

  matchesWithDuplicatedPlayer: Match[] = [];
  matchesWithoutDuplicatedPlayer: Match[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const matchesWithDuplicatedPlayerTmp: Match[] = [];
    const matchesWithoutDuplicatedPlayerTmp: Match[] = [];

    this.data?.matches.forEach(match => {
      if (match.status != 'finished' && !match.tableNum) {
        if (match.playerAduplicated || match.playerBduplicated) {
          matchesWithDuplicatedPlayerTmp.push(match);
        } else if (match.playerAid || match.playerBid) {
          matchesWithoutDuplicatedPlayerTmp.push(match);
        }
      }
    });

    this.matchesWithDuplicatedPlayer = matchesWithDuplicatedPlayerTmp;
    this.matchesWithoutDuplicatedPlayer = matchesWithoutDuplicatedPlayerTmp;
  }

}
