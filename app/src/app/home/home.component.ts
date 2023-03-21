import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {IntegrationService} from 'src/app/integration/integration-service';
import {Tournament} from 'src/app/model/tournament';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private readonly integrationSubscription: Subscription;

  integrationData: BehaviorSubject<IntegrationData> = new BehaviorSubject<IntegrationData>(new IntegrationData());

  tournament: Tournament | undefined;

  constructor(
    private integrationService: IntegrationService
  ) {

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

  updateData() {
    this.integrationService.retrieveIntegrationData().subscribe(update => {
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
