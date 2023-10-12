import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Match} from 'src/app/model/match';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit, OnChanges {

  @Input()
  matches: Match[] = [];

  selected: Match | undefined;

  constructor() {
  }

  ngOnInit(): void {
    this.setDefaultMatch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDefaultMatch();
  }

  setDefaultMatch(): void {
    if (!this.selected) {
      this.selected = this.matches.find(current => current.startTime);
    }
  }

}
