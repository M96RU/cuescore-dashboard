import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-timer-countdown',
  templateUrl: './timer-countdown.component.html',
  styleUrls: ['./timer-countdown.component.scss']
})
export class TimerCountdownComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  before: Date | undefined;

  time: number = 90;
  alreadyVibrateFault = false;
  alreadyVibrateWarning = false;

  private subscription: Subscription | undefined;

  constructor() {
  }

  refresh(): void {
    console.log(this.before);
    console.log(new Date().getTime());
    const beforeMillis = this.before?.getTime();
    if (beforeMillis) {
      const millis = beforeMillis - new Date().getTime();

      const timeLeft = Math.round(millis / 1000);

      if (this.alreadyVibrateWarning && timeLeft > 20) {
        this.alreadyVibrateWarning = false;
      }
      if (this.alreadyVibrateFault && timeLeft > 0) {
        this.alreadyVibrateFault = false;
      }

      if (timeLeft <= 20 && !this.alreadyVibrateWarning) {
        this.alreadyVibrateWarning = true;
        this.vibrate([700]);
      }

      if (timeLeft > 0) {
        this.time = timeLeft;
      } else {
        this.time = 0;

        if (!this.alreadyVibrateFault) {
          this.alreadyVibrateFault = true;
          this.vibrate([500, 500, 500, 500, 1000]);
        }
      }
    } else {
      this.time = 90;
    }

  }

  ngOnInit(): void {

    this.subscription = interval(500).subscribe(_ => {
      this.refresh();
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  vibrate(pattern: VibratePattern): void {
    if (window && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }
}
