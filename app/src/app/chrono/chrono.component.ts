import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Match} from 'src/app/model/match';
import {interval, Subscription} from 'rxjs';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-chrono',
  templateUrl: './chrono.component.html',
  styleUrls: ['./chrono.component.scss']
})
export class ChronoComponent implements OnInit, OnChanges {

  ready = false;

  @Input()
  match: Match | undefined;

  private subscription: Subscription | undefined;

  timeOver = false;
  alertName : string | undefined;
  displayAlert = false;
  chipColor: ThemePalette | undefined;

  firstWarnAt: number = 20;
  lastWarnAt: number = 10;

  firstWarnAtDone = false;
  lastWarnAtDone = false;

  minutesLeft: number = 0;
  secondsLeft: number | undefined;


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.timeOver = false;
    this.displayAlert = false;
  }

  ngOnInit(): void {
    this.subscription = interval(500).subscribe(_ => {
      this.refresh();
    });
  }
  setWarnAsDone(what: string | undefined): void {
    if (this.match && what) {
      localStorage.setItem('match-' + this.match.id + '-warn-' + what, 'done');
    }
  }
  isWarnDone(what: string): boolean {
    if (this.match && localStorage.getItem('match-' + this.match.id + '-warn-' + what)) {
      return true;
    }
    return false;
  }

  refresh(): void {

    const match = this.match;
    if (match && match.startTime && match.maxTime) {
      const nowTimeMillis = new Date().getTime();
      const maxTimeMillis = match.maxTime.getTime();
      if (maxTimeMillis > nowTimeMillis) {
        this.timeOver = false;
        const millisLeft = maxTimeMillis - nowTimeMillis;
        const secondsLeft = Math.floor(millisLeft / 1000);
        this.minutesLeft = Math.floor(secondsLeft / 60);
        this.secondsLeft = secondsLeft - 60 * this.minutesLeft;

      } else {
        this.timeOver = true;
        this.minutesLeft = 0;
        this.secondsLeft = 0;
      }

      if (this.timeOver) {
        this.chipColor = 'accent';
        this.alertName = 'last';
        this.displayAlert = !this.isWarnDone(this.alertName);
      } else if(this.minutesLeft<this.lastWarnAt) {
        this.chipColor = 'accent';
        this.alertName = 'second';
        this.displayAlert = !this.isWarnDone(this.alertName);
      } else if(this.minutesLeft<this.firstWarnAt) {
        this.chipColor = 'warn';
        this.alertName = 'first';
        this.displayAlert = !this.isWarnDone(this.alertName);
      }

      this.ready = true;
    }
  }

}
