import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnInit {

  playing = false;

  incomingMatches: Match[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public player: Player) {
    this.playing = player.inProgress.length > 0;
    this.incomingMatches = player.matches.filter(match => match.status != 'finished' && match.status != 'playing');
  }

  ngOnInit(): void {
  }

}
