import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class TournamentService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getCuescoreTournament(id: string): Observable<any> {
    return this.httpClient.get<any>('https://api.cuescore.com/tournament/?id=' + id);
  }

}
