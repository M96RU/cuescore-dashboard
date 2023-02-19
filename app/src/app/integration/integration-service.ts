import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {forkJoin, map, Observable, of} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';
import {Table} from 'src/app/model/table';
import {Tournament} from 'src/app/model/tournament';
import {TournamentService} from 'src/app/tournament/tournament.service';

@Injectable()
export class IntegrationService {

  constructor(
    private httpClient: HttpClient,
    private tournamentService: TournamentService
  ) {
  }

  parsePlayer(cuescore: any): Player | null {
    if (cuescore && cuescore.playerId > 0 && cuescore.playerId != '1000615') {
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
      const tableNum = parseInt(cuescore.name); // description for name ?
      const table = new Table(tableNum);
      table.tableId = cuescore.tableId;
      return table;
    } else {
      return null
    }
  }

  retrieveIntegrationData(): Observable<IntegrationData> {

    const tournaments = this.tournamentService.getTournaments();

    if (tournaments.length == 0) {
      return of(new IntegrationData());
    }

    const matches: Match[] = [];
    const players: Map<string, Player> = new Map();
    const tables: Map<number, Table> = new Map();

    return forkJoin(tournaments.map(id => this.tournamentService.getCuescoreTournament(id))).pipe(
      map((responses) => {

          const integrationData = new IntegrationData();

          responses.forEach((response) => {
            const tournament = new Tournament(response.tournamentId, response.name, response.url);
            integrationData.tournaments.push(tournament);

            if (response.matches) {
              response.matches.forEach((cuescoreMatch: any) => {

                const match = new Match();
                match.id = cuescoreMatch.matchId;
                match.playerAscore = cuescoreMatch.scoreA;
                match.playerBscore = cuescoreMatch.scoreB;
                match.status = cuescoreMatch.matchstatus;
                match.tournament = tournament.name;
                match.round = cuescoreMatch.roundName;
                match.order = cuescoreMatch.matchno;
                if (cuescoreMatch.starttime) {
                  match.startTime = moment.utc(cuescoreMatch.starttime).toDate();
                }
                if (cuescoreMatch.stoptime) {
                  match.finishedTime = moment.utc(cuescoreMatch.stoptime).toDate();
                }

                // Players
                const playerA = this.parsePlayer(cuescoreMatch.playerA);
                if (playerA) {
                  match.playerAid = playerA.id;
                  match.playerAname = playerA.name;
                  if (!players.has(playerA.id)) {
                    // init the player
                    playerA.matches.push(match);
                    players.set(playerA.id, playerA);
                  } else {
                    // add the match to existing player
                    const existingPlayer = players.get(playerA.id);
                    if (existingPlayer) {
                      existingPlayer.matches.push(match);
                      players.set(existingPlayer.id, existingPlayer);
                    }
                  }
                } else {
                  match.playerAname = cuescoreMatch.playerA?.name;
                }
                const playerB = this.parsePlayer(cuescoreMatch.playerB);
                if (playerB) {
                  match.playerBid = playerB.id;
                  match.playerBname = playerB.name;
                  if (!players.has(playerB.id)) {
                    // init the player
                    playerB.matches.push(match);
                    players.set(playerB.id, playerB);
                  } else {
                    // add the match to existing player
                    const existingPlayer = players.get(playerB.id);
                    if (existingPlayer) {
                      existingPlayer.matches.push(match);
                      players.set(existingPlayer.id, existingPlayer);
                    }
                  }
                } else {
                  match.playerBname = cuescoreMatch.playerB?.name;
                }

                const table = this.parseTable(cuescoreMatch.table)
                if (table) {
                  match.tableNum = table.num;
                  if (!tables.has(table.num)) {
                    tables.set(table.num, table);
                  }
                }

                matches.push(match);

              });
            }
          });

          // check player duplicated
          matches.forEach(match => {
            if (match.playerAid) {
              const playerA = players.get(match.playerAid);
              if (playerA) {
                const playingMatches = playerA.matches.filter(match => match.status != 'finished');
                match.playerAduplicated = playingMatches.length > 1;

                if (playingMatches.length > 0) {
                  const first = playingMatches[0];
                  match.playerAtable = first.tableNum;
                }
              }
            }
            if (match.playerBid) {
              const playerB = players.get(match.playerBid);
              if (playerB) {
                const playingMatches = playerB.matches.filter(match => match.status != 'finished');
                match.playerBduplicated = playingMatches.length > 1;

                if (playingMatches.length > 0) {
                  const first = playingMatches[0];
                  match.playerBtable = first.tableNum;
                }
              }
            }
            integrationData.matches.push(match);
          });

          integrationData.tables = Array.from(tables.values());
          integrationData.players = Array.from(players.values());
          return integrationData;
        }
      )
    )
  }
}
