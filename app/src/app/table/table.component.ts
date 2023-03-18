import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input()
  data: IntegrationData | undefined;

  tables: Map<number, Match[]> = new Map();

  keepFinishedMatchesDuringMillis = 5 * 60 * 1000; // 5 minutes x 60 seconds x 1000 millis

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const playingMatchesTables: Map<number, Match[]> = new Map();
    const finishedMatchesTables: Map<number, Match[]> = new Map();

    for (let tableId = 1; tableId < 21; tableId++) {
      playingMatchesTables.set(tableId, []);
      finishedMatchesTables.set(tableId, []);
    }

    this.data?.matches.forEach(match => {
      if (match.tableNum) {
        if (match.status == 'finished') {
          const tableMatches: Match[] = finishedMatchesTables.get(match.tableNum) || [];
          tableMatches.push(match);
          finishedMatchesTables.set(match.tableNum, tableMatches);
        } else {
          const tableMatches: Match[] = playingMatchesTables.get(match.tableNum) || [];
          tableMatches.push(match);
          playingMatchesTables.set(match.tableNum, tableMatches);
        }
      }
    });

    for (const [tableNum, playingMatches] of playingMatchesTables.entries()) {
      if (playingMatches.length == 0) {
        const finishedMatches = finishedMatchesTables.get(tableNum) || [];
        if (finishedMatches.length > 0) {
          const lastFinishedMatches = finishedMatches.sort((first: Match, second: Match) => {
            if (!first.finishedTime) {
              return 1;
            }
            if (!second.finishedTime) {
              return -1;
            }
            return second.finishedTime.getTime() - first.finishedTime.getTime();
          });
          const lastFinishedMatch = lastFinishedMatches[0];
          if (lastFinishedMatch.finishedTime) {
            const now = new Date();
            const finishedSinceMillis = now.getTime() - lastFinishedMatch.finishedTime.getTime();
            if (finishedSinceMillis < this.keepFinishedMatchesDuringMillis) {
              playingMatchesTables.set(tableNum, [lastFinishedMatch]);
            }
          }
        }
      }
    }

    this.tables = playingMatchesTables;
  }

}
