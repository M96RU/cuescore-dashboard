import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  private subscription: Subscription | undefined;

  before: Date | undefined;

  time: number = 90;

  alreadyBreak = false;
  alreadyPlayed = false;
  alreadyExtA = false;
  alreadyExtB = false;

  constructor() {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
  }

  start(): void {
    this.timerStart();

    this.setTime(90);
    this.alreadyBreak = true;
  }

  restart(): void {
    this.timerStop();

    this.alreadyBreak = false;
    this.alreadyPlayed = false;
    this.alreadyExtA = false;
    this.alreadyExtB = false;
    this.before = undefined;
  }

  setTime(seconds: number): void {
    const now = new Date();
    const millisToAdd = seconds * 1000;
    const beforeMillis = now.getTime() + millisToAdd;
    const before = new Date();
    before.setTime(beforeMillis);

    this.before = before;
    this.time = seconds;
  }

  extensionA(): void {
    this.alreadyExtA = true;
    this.extension();
  }

  extensionB(): void {
    this.alreadyExtB = true;
    this.extension();
  }

  extension(): void {
    let millisExtension = 45 * 1000;
    if (this.before) {
      const now = new Date();
      millisExtension += this.before.getTime() - now.getTime();
    }
    const extensionSeconds: number = Math.round(millisExtension / 1000);
    this.setTime(extensionSeconds);
  }

  timerStart(): void {
    this.timerStop();

    this.setTime(90);

    this.subscription = interval(1000).subscribe(x => {
      if (this.before) {
        const millis = this.before.getTime() - new Date().getTime();

        const timeLeft = Math.round(millis / 1000);
        if (timeLeft > 0) {
          this.time = timeLeft;
        } else {
          this.time = 0;
        }
      } else {
        this.time = 90;
      }
    });
  }

  timerStop(): void {
    this.before = undefined;
    this.time = 90;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  next(): void {
    this.alreadyPlayed = true;
    this.setTime(45);
  }
}
