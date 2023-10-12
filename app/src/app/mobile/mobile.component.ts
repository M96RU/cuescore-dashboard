import {Component, Input, OnInit} from '@angular/core';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {

  @Input()
  matches: Match[] = [];

  selected: Match | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}
