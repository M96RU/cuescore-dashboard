import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';
import {PlayerDetailComponent} from 'src/app/player-detail/player-detail.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  clic: boolean = false;

  @Input()
  matchContext: Match | undefined;

  @Input()
  player: Player | undefined;

  alreadyPlayingOnTableWarning: string | undefined;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.player && this.matchContext) {
      const otherTables = this.player.inProgress.filter(match => match.id != this.matchContext?.id);
      if (otherTables.length > 0) {
        this.alreadyPlayingOnTableWarning = this.player.name + ' : match en cours sur la table ' + otherTables[0].tableNum;
      }
    }

  }

  openPlayerDetail(player: Player): void {
    if (this.clic) {
      this.dialog.open(PlayerDetailComponent, {
        data: player,
        minWidth: '50%'
      });
    }
  }
}
