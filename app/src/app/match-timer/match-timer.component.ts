import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-match-timer',
  templateUrl: './match-timer.component.html',
  styleUrls: ['./match-timer.component.scss']
})
export class MatchTimerComponent implements OnInit {

  matchId: string | undefined

  cuescoreUrl: SafeResourceUrl | undefined;

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
    }
  }

}
