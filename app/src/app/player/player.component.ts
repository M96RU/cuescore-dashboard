import {Component, Input, OnInit} from '@angular/core';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  matchContext: Match | undefined;

  @Input()
  player: Player | undefined;
  duplicate = false;
  inProgress: Match[] = [];
  inProgressWarning: string | undefined;
  alreadyPlayingOnTableWarning: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
    if (this.player) {
      const playingMatches = this.player.matches.filter(match => match.status != 'finished');
      this.duplicate = playingMatches.length > 1;
      this.inProgress = playingMatches.filter(match => match.tableNum);
      if (this.inProgress.length > 1) {
        const tables = this.inProgress.map(match => match.tableNum).sort((t1, t2) => (t1 || 0) - (t2 || 0)).join(' - ');
        this.inProgressWarning = this.player.name + ' sur plusieurs tables: ' + tables;
      }
      if (this.matchContext) {
        const otherTables = this.inProgress.filter(match => match.id != this.matchContext?.id);
        if (otherTables.length > 0) {
          this.alreadyPlayingOnTableWarning = this.player.name + ' : match en cours sur la table ' + otherTables[0].tableNum;
        }
      }
    }
  }

}
