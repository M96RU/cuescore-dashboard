import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {IntegrationData} from 'src/app/integration/integration-data';
import {MatchTimerComponent} from 'src/app/match-timer/match-timer.component';
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
  nbTables: number = 20;

  @Input()
  data: IntegrationData | undefined;

  @Input()
  tournament: Tournament | undefined;

  matches: Match[] = [];
  availableTables: number[] | undefined;

  constructor(private dialog: MatDialog) {
  }

  displayedColumns: string[] = ['table', 'tournament', 'order', 'scorer', 'timer', 'playerA', 'playerAscore', 'raceTo', 'playerBscore', 'playerB', 'start', 'end', 'minutes'];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshMatches();
  }

  refreshMatches() {
    if (this.data) {

      if (!this.tournament) {
        this.availableTables = undefined;
        this.matches = this.computeLiveMatches(this.data.matches);
      } else {
        this.availableTables = this.getAvailableTables(this.data.matches);
        this.matches = this.filterMatches(this.data.matches, this.tournament)
      }
    }
  }

  getAvailableTables(matches: Match[]): number[] | undefined {
    const availableTables: number[] = [];
    const maxTable = Math.max(...matches.map(match => match.tableNum || 0));
    const nbTablesToUse = Math.max(maxTable, this.nbTables);
    for (let tableNum = 1; tableNum <= nbTablesToUse; tableNum++) {
      const tableMatches = matches.filter(match => match.tableNum == tableNum);
      const tableMatchesInProgress = tableMatches.filter(match => match.status != 'finished');
      if (tableMatchesInProgress.length == 0) {
        availableTables.push(tableNum);
      }
    }
    if (availableTables.length > 0) {
      return availableTables;
    }
    return undefined;
  }

  computeLiveMatches(matches: Match[]): Match[] {

    const maxTable = Math.max(...matches.map(match => match.tableNum || 0));
    const nbTablesToUse = Math.max(maxTable, this.nbTables);

    const liveMatches: Match[] = [];

    for (let tableNum = 1; tableNum <= nbTablesToUse; tableNum++) {
      const tableMatches = matches.filter(match => match.tableNum == tableNum);
      const tableMatchesInProgress = tableMatches.filter(match => match.status != 'finished');
      if (tableMatchesInProgress.length > 1) {
        tableMatchesInProgress.forEach(match => {
          match.tableNumWarning = tableMatchesInProgress.length + ' matches on table ' + tableNum;
          liveMatches.push(match);
        });
      } else if (tableMatchesInProgress.length > 0) {
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

  nbTablesMinus(): void {
    if (this.nbTables > 0) {
      this.nbTables--;
      this.refreshMatches();
    }
  }

  nbTablesPlus(): void {
    this.nbTables++;
    this.refreshMatches();
  }

  openMatchScorer(match: Match): void {
    if (match.scorerUrl) {
      window.open(match.scorerUrl, 'scorer', 'popup');
    }
  }

  openMatchTimer(match: Match): void {
    this.dialog.open(MatchTimerComponent, {
      data: match,
      minWidth: '100%',
      minHeight: '100%'
    });
  }
}
