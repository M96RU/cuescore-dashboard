import {Component, Input, OnInit} from '@angular/core';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input()
  match: Match | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
