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

  getTournaments(): string[] {
    const tournaments: string[] = [];
    const joinedTournaments = localStorage.getItem('tournaments')
    if (joinedTournaments) {
      joinedTournaments.split('#').forEach(id => {
        tournaments.push(id);
      });
    }
    return tournaments;
  }

  addTournamentId(tournamentId: string) {
    const tournaments = this.getTournaments();
    const exists = tournaments.find(current => current == tournamentId);
    if (!exists) {
      tournaments.push(tournamentId);
      localStorage.setItem('tournaments', tournaments.join('#'));
    }
  }

}
