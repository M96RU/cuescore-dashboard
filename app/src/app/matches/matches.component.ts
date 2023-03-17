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

  keepFinishedMatchesDuringMillis = 5 * 60 * 1000; // 5 minutes x 60 seconds x 1000 millis

  displayBlanks = false;
  displayReady = false;

  @Input()
  data: IntegrationData | undefined;

  @Input()
  tournament: Tournament | undefined;

  matches: Match[] = [];

  constructor() {
  }

  displayedColumns: string[] = ['table', 'tournament', 'order', 'playerA', 'playerAscore', 'raceTo', 'playerBscore', 'playerB', 'start', 'end', 'minutes'];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshMatches();
  }

  refreshMatches() {
    if (this.data) {
      if (!this.tournament) {
        this.matches = this.computeLiveMatches(this.data.matches);
      } else {
        this.matches = this.filterMatches(this.data.matches, this.tournament)
      }
    }
  }

  computeLiveMatches(matches: Match[]) : Match[] {

    const nbTables = Math.max(...matches.map(match => match.tableNum || 0));

    const liveMatches: Match[] = [];

    for (let tableNum=1; tableNum<=nbTables; tableNum++) {
      const tableMatches = matches.filter(match => match.tableNum == tableNum);
      const tableMatchesInProgress = tableMatches.filter(match => match.status != 'finished');
      if (tableMatchesInProgress.length>1) {
        tableMatchesInProgress.forEach(match => {
          match.tableNumWarning = tableMatchesInProgress.length + ' matches on table ' + tableNum;
          liveMatches.push(match);
        });
      }else if (tableMatchesInProgress.length>0) {
        liveMatches.push(...tableMatchesInProgress);
      } else {

        // find last finished match
        let finishedMatchFound = false;
        const finishedMatches = tableMatches.filter(match => match.status == 'finished');

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
              finishedMatchFound = true;
              lastFinishedMatch.tableNumWarning = 'Table ' + tableNum + ' disponible';
              liveMatches.push(lastFinishedMatch);
            }
          }
        }

        if (!finishedMatchFound) {
          const emptyTable = new Match();
          emptyTable.tableNum = tableNum;
          emptyTable.tableNumWarning = 'Table ' + tableNum + ' disponible';
          liveMatches.push(emptyTable);
        }
      }
    }

    return liveMatches.sort((m1, m2) => (m1.tableNum || 0) - (m2.tableNum || 0));
  }


  private filterMatches(matches: Match[], tournament: Tournament): Match[] {
    let tournamentMatches = matches.filter(match => match.tournamentId === tournament.id);

    return tournamentMatches.filter(match => {

      // Hide blanks
      if (!this.displayBlanks && match.blank) {
        return false;
      }

      // Hide matches not ready to be launched
      if (this.displayReady) {
        if (match.status == 'finished' || !match.playerA || !match.playerB) {
          return false;
        }
        const matchesInProgressA = match.playerA?.inProgress.filter(m => m.id != match.id).length || 0
        if (matchesInProgressA > 0) {
          return false;
        }
        const matchesInProgressB = match.playerB?.inProgress.filter(m => m.id != match.id).length || 0
        if (matchesInProgressB > 0) {
          return false;
        }
      }
      return true;
    });

  }
}
