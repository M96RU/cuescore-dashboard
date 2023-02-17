import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, map, Observable} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';
import {Table} from 'src/app/model/table';
import {Tournament} from 'src/app/model/tournament';
import {TournamentService} from 'src/app/tournament/tournament.service';

@Injectable()
export class IntegrationService {

  // tournaments = ['24763825', '21213595'];

  constructor(
    private httpClient: HttpClient,
    private tournamentService: TournamentService
  ) {
  }

  parsePlayer(cuescore: any): Player | null {
    if (cuescore && cuescore.playerId > 0) {
      const player = new Player();
      player.id = cuescore.playerId;
      player.name = cuescore.name;
      return player;
    } else {
      return null
    }
  }

  parseTable(cuescore: any): Table | null {
    if (cuescore && cuescore.tableId > 0) {
      const table = new Table();
      table.id = cuescore.tableId;
      table.name = cuescore.name; // description ?
      return table;
    } else {
      return null
    }
  }

  retrieveIntegrationData(): Observable<IntegrationData> {

    const players: Map<string, Player> = new Map();
    const tables: Map<string, Table> = new Map();

    return forkJoin(this.tournamentService.getTournaments().map(id => this.tournamentService.getCuescoreTournament(id))).pipe(
      map((responses) => {

          const integrationData = new IntegrationData();

          responses.forEach((response) => {
            const tournament = new Tournament();
            tournament.id = response.tournamentId;
            tournament.name = response.name
            integrationData.tournaments.push(tournament);

            if (response.matches) {
              response.matches.forEach((cuescoreMatch: any) => {

                const match = new Match();
                match.id = cuescoreMatch.matchId;
                match.playerAscore = cuescoreMatch.scoreA;
                match.playerBscore = cuescoreMatch.scoreB;

                // Players
                const playerA = this.parsePlayer(cuescoreMatch.playerA);
                if (playerA) {
                  match.playerAid = playerA.id;
                  if (!players.has(playerA.id)) {
                    players.set(playerA.id, playerA);
                  }
                }
                const playerB = this.parsePlayer(cuescoreMatch.playerB);
                if (playerB) {
                  match.playerBid = playerB.id;
                  if (!players.has(playerB.id)) {
                    players.set(playerB.id, playerB);
                  }
                }

                const table = this.parseTable(cuescoreMatch.table)
                if (table) {
                  match.tableId = table.id;
                  if (!tables.has(table.id)) {
                    tables.set(table.id, table);
                  }
                }

                integrationData.matches.push(match);

              });
            }
          });

          integrationData.tables = Array.from(tables.values());
          integrationData.players = Array.from(players.values());
          return integrationData;
        }
      )
    )
  }
}
