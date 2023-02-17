import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {IntegrationService} from 'src/app/integration/integration-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  private readonly integrationSubscription: Subscription;

  integrationData: BehaviorSubject<IntegrationData> = new BehaviorSubject<IntegrationData>(new IntegrationData());

  constructor(
    private integrationService: IntegrationService
  ) {

    // first init
    this.updateData();

    // periodical updates
    this.integrationSubscription = interval(10000).subscribe(() => {
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
      this.integrationData.next(update);
    });

  }
}
