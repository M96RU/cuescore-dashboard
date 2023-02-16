import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, map, Observable} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Player} from 'src/app/model/player';
import {Tournament} from 'src/app/model/tournament';

@Injectable()
export class IntegrationService {

  tournaments = ['24763825', '21213595'];

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  retrieveIntegrationData(): Observable<IntegrationData> {

    const players: Map<string, Player> = new Map();

    return forkJoin(this.tournaments.map(id => this.httpClient.get<any>('https://api.cuescore.com/tournament/?id=' + id))).pipe(
      map((responses) => {

          const integrationData = new IntegrationData();

          responses.forEach((response) => {
            const tournament = new Tournament();
            tournament.id = response.tournamentId;
            tournament.name = response.name
            integrationData.tournaments.push(tournament);
          });
          
          integrationData.players = Array.from(players.values());
          return integrationData;
        }
      )
    )
  }
}
