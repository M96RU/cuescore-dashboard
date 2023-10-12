import {Component, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {IntegrationService} from 'src/app/integration/integration-service';
import {Tournament} from 'src/app/model/tournament';
import {TournamentService} from '../tournament/tournament.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private readonly integrationSubscription: Subscription;

  readonly: string[] | undefined;

  integrationData: BehaviorSubject<IntegrationData> = new BehaviorSubject<IntegrationData>(new IntegrationData());

  tournament: Tournament | undefined;

  smallScreen = false;

  constructor(
    private integrationService: IntegrationService,
    private tournamentService: TournamentService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver
  ) {

    this.responsive.observe(Breakpoints.Web)
      .subscribe(result => {

        if (result.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }

  });

    const stringTournaments = this.activatedRoute.snapshot.queryParamMap.get('tournaments');
    if (stringTournaments) {
      this.readonly = stringTournaments.split('_');
    }

    // first init
    this.updateData();

    // periodical updates
    this.integrationSubscription = interval(60000).subscribe(() => {
      this.updateData();
    });
  }

  ngOnDestroy(): void {
    if (this.integrationSubscription) {
      this.integrationSubscription.unsubscribe()
    }
  }

  copySharedUrl(): void {

    const savedTournaments = this.tournamentService.getTournaments();
    if (savedTournaments && savedTournaments.length > 0) {
      const readonlyUrl = window.location.href + '?tournaments=' + savedTournaments.join('_');
      navigator.clipboard.writeText(readonlyUrl);
      this.snackBar.open('Copié: '+readonlyUrl, undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500
      });
    } else {
      this.snackBar.open('Non copié... aucun tournoi configuré', undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500
      });

    }
  }

  updateData() {
    this.integrationService.retrieveIntegrationData(this.readonly).subscribe(update => {
      // if (!this.tournament && update.tournaments.length>0) {
      //   this.selectTournament(update.tournaments[0]);
      // }
      this.integrationData.next(update);
    });

  }

  selectTournament(tournament: Tournament | undefined): void {
    this.tournament = tournament;
  }

}
