import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-match-timer',
  templateUrl: './match-timer.component.html',
  styleUrls: ['./match-timer.component.scss']
})
export class MatchTimerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public match: Match | undefined) { }

  ngOnInit(): void {
  }

}
