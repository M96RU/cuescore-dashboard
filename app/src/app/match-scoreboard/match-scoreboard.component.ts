import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
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

  cuescoreUrl: SafeResourceUrl | undefined;

  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    const matchIdPathParam = this.route.snapshot.paramMap.get('id');
    const tableId = this.route.snapshot.queryParamMap.get('tableId');

    if (tableId) {
      const url = 'https://cuescore.com/scoreboard/overlay/?tableId=' + tableId;
      this.cuescoreUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    if (matchIdPathParam) {
      this.matchId = matchIdPathParam;
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private start(): void {
    this.subscription = interval(500).subscribe(_ => {
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
