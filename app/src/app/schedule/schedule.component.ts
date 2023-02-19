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

  matchesReadyToPlay: Match[] = [];
  matchesWaitingForSomething: Match[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const matchesReadyToPlayAlreadyPlaying: Match[] = [];
    const matchesReadyToPlayBetweenDuplicated: Match[] = [];
    const matchesReadyToPlayWithDuplicated: Match[] = [];
    const matchesReadyToPlayWithoutDuplicated: Match[] = [];
    const matchesOnePlayerMissingWithDuplicated: Match[] = [];
    const matchesOnePlayerMissingWithoutDuplicated: Match[] = [];

    this.data?.matches.forEach(match => {
      if (match.status != 'finished' && !match.tableNum) {

        if (match.playerAtable || match.playerBtable) {
          matchesReadyToPlayAlreadyPlaying.push(match);
        } else if (match.playerAduplicated && match.playerBduplicated) {
          // both players are duplicated: high priority !
          matchesReadyToPlayBetweenDuplicated.push(match);

        } else if (match.playerAduplicated || match.playerBduplicated) {
          // at least one player is a duplicated
          if (match.playerAid && match.playerBid) {
            // duplicated + match ready to play
            matchesReadyToPlayWithDuplicated.push(match);

          } else if (match.playerAid || match.playerBid) {
            matchesOnePlayerMissingWithDuplicated.push(match);
          } // else no player in the match: not displayed

        } else if (match.playerAid && match.playerBid) {
          matchesReadyToPlayWithoutDuplicated.push(match);
        } else if (match.playerAid || match.playerBid) {
          matchesOnePlayerMissingWithoutDuplicated.push(match);
        }
      }
    });

    const matchesReadyToPlayTmp: Match[] = [];
    matchesReadyToPlayTmp.push(...matchesReadyToPlayBetweenDuplicated);
    matchesReadyToPlayTmp.push(...matchesReadyToPlayWithDuplicated);
    matchesReadyToPlayTmp.push(...matchesReadyToPlayWithoutDuplicated);

    const matchesWaitingForSomethingTmp: Match[] = [];
    matchesWaitingForSomethingTmp.push(...matchesReadyToPlayAlreadyPlaying);
    matchesWaitingForSomethingTmp.push(...matchesOnePlayerMissingWithDuplicated);
    matchesWaitingForSomethingTmp.push(...matchesOnePlayerMissingWithoutDuplicated);

    this.matchesReadyToPlay = matchesReadyToPlayTmp;
    this.matchesWaitingForSomething = matchesWaitingForSomethingTmp;
  }

}
