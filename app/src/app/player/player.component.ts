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

  alreadyPlayingOnTableWarning: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
    if (this.player && this.matchContext) {
      const otherTables = this.player.inProgress.filter(match => match.id != this.matchContext?.id);
      if (otherTables.length > 0) {
        this.alreadyPlayingOnTableWarning = this.player.name + ' : match en cours sur la table ' + otherTables[0].tableNum;
      }
    }

  }

}
