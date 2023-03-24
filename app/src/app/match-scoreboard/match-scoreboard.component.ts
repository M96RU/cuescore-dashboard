import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {Timer} from 'src/app/model/timer';

@Component({
  selector: 'app-match-scoreboard',
  templateUrl: './match-scoreboard.component.html',
  styleUrls: ['./match-scoreboard.component.scss']
})
export class MatchScoreboardComponent implements OnInit, OnDestroy {

  matchId: string | undefined

  before: Date | undefined

  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    const matchIdPathParam = this.route.snapshot.paramMap.get('id');
    if (matchIdPathParam) {
      this.matchId = matchIdPathParam;
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private start(): void {
    this.subscription = interval(1000).subscribe(_ => {
      this.httpClient.get<Timer>('https://cuescore-dashboard-api.vercel.app/api/match/' + this.matchId).subscribe(timerData => {
        if (timerData && timerData.beforeMillis) {
          const date = new Date();
          date.setTime(timerData.beforeMillis);
          this.before = date;
        }
      });
    });
  }

}
