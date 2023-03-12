import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {IntegrationService} from 'src/app/integration/integration-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  reason = '';

  private readonly integrationSubscription: Subscription;

  integrationData: BehaviorSubject<IntegrationData> = new BehaviorSubject<IntegrationData>(new IntegrationData());

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

  close(reason: string) {
    this.reason = reason;
    this.sidenav?.close();
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
