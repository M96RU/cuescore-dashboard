import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {Timer} from 'src/app/model/timer';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input()
  matchId: string | undefined;

  before: Date | undefined;

  // time: number = 90;

  alreadyBreak = false;
  alreadyPlayed = false;
  alreadyExtA = false;
  alreadyExtB = false;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  pushTimerData(): void {
    if (this.matchId) {
      const timer = new Timer();
      timer.id = this.matchId;
      timer.beforeMillis = this.before?.getTime();
      this.httpClient.post('https://cuescore-dashboard-api.vercel.app/api/match', timer).subscribe();
    }
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
    // this.time = seconds;
    this.pushTimerData();
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
    // this.alreadyVibrateFault = false;
    // this.alreadyVibrateWarning = false;
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

  }

  timerStop(): void {
    this.before = undefined;
    // this.time = 90;
  }

  next(): void {
    // this.alreadyVibrateFault = false;
    // this.alreadyVibrateWarning = false;
    this.alreadyPlayed = true;
    this.setTime(45);
  }
}
