import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {forkJoin, map, Observable, of} from 'rxjs';
import {IntegrationData} from 'src/app/integration/integration-data';
import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';
import {Table} from 'src/app/model/table';
import {Tournament} from 'src/app/model/tournament';
import {TournamentService} from 'src/app/tournament/tournament.service';

const WALK_OVER_PLAYER = '1000615';

const SCORER_CODE = new Map<string, string>([
  ['12812770', '68537fab'], // table 1
  ['12812773', '8041d95e'], // table 2
  ['12812776', 'e241b2b7'], // table 3
  ['12812779', '2bf6b7e8'], // table 4
  ['12812782', '68a2b136'], // table 5
  ['12812785', 'e41be679'], // table 6
  ['12812797', 'de108f97'], // table 7
  ['12812800', '93c9d835'], // table 8
  ['12812803', '48d19094'], // table 9
  ['12812806', 'e91a16ed'], // table 10
  ['12812812', 'f9df0bac'], // table 11
  ['12812815', '53bb9a74'], // table 12
  ['12812818', '1e42635d'], // table 13
  ['12812824', 'a3c6665d'], // table 14
  ['12812827', '68354abc'], // table 15
  ['12812830', 'eb66652a'], // table 16
  ['12812833', '7f8283bc'], // table 17
  ['12812839', 'aab530ea'], // table 18
  ['12812842', 'b0d08428'], // table 19
  ['12812845', '8891f133'] // table 20
]);

@Injectable()
export class IntegrationService {

  constructor(
    private tournamentService: TournamentService
  ) {
  }

  parseDateTime(datetime: any): Date | undefined {
    if (datetime) {
      if (datetime.includes('+') || datetime.includes('GMT')) {
        // to check with real Data, seems not needed for French tournaments
        return moment.utc(datetime).toDate();
      }
      return new Date(datetime);
    }
    return undefined;
  }

  parsePlayer(cuescore: any): Player | null {
    if (cuescore && cuescore.playerId > 0 && cuescore.playerId != WALK_OVER_PLAYER) {
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

      const scorerUrlCode = SCORER_CODE.get('' + table.tableId);
      if (scorerUrlCode) {
        table.scorerUrl = 'https://cuescore.com/scoreboard/?code=' + scorerUrlCode;
      }

      return table;
    } else {
      return null
    }
  }

  retrieveIntegrationData(readonly: string[] | undefined): Observable<IntegrationData> {

    const tournaments = readonly || this.tournamentService.getTournaments();

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
                match.raceTo = cuescoreMatch.raceTo;
                match.playerAscore = cuescoreMatch.scoreA;
                match.playerBscore = cuescoreMatch.scoreB;
                match.status = cuescoreMatch.matchstatus;
                match.tournamentId = tournament.id;
                match.tournament = tournament.name; // to remove
                match.round = cuescoreMatch.roundName;
                match.order = cuescoreMatch.matchno;
                match.startTime = this.parseDateTime(cuescoreMatch.starttime);
                match.finishedTime = this.parseDateTime(cuescoreMatch.stoptime);

                if (match.startTime) {
                  const dateToCompare = match.finishedTime || new Date();
                  const millis = dateToCompare.getTime() - match.startTime.getTime();
                  match.minutes = Math.round(millis / 60000);

                  let maxMinutes = 60; // 1h by default
                  if (match.raceTo) {
                    if (match.raceTo >= 5) {
                      maxMinutes = 105; // 1h45
                    } else if (match.raceTo >= 4) {
                      maxMinutes = 75; // 1h15
                    }
                  }
                  const maxTimeMillis = match.startTime.getTime() + maxMinutes * 60000;
                  match.maxTime = new Date(maxTimeMillis);
                }

                // Players
                match.blank = cuescoreMatch.playerA?.playerId == WALK_OVER_PLAYER || cuescoreMatch.playerB?.playerId == WALK_OVER_PLAYER;

                const playerA = this.parsePlayer(cuescoreMatch.playerA);
                if (playerA) {
                  match.playerAid = playerA.id;
                  // match.playerAname = playerA.name;
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
                  // match.playerBname = playerB.name;
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
                  match.tableCuescoreId = table.tableId;
                  match.tableNum = table.num;
                  if (match.status != 'finished') {
                    match.scorerUrl = table.scorerUrl;
                  }
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
                match.playerA = playerA;
              }
            }
            if (match.playerBid) {
              const playerB = players.get(match.playerBid);
              if (playerB) {
                match.playerB = playerB;
              }
            }
            integrationData.matches.push(match);
          });

          integrationData.players = this.computePlayersData(Array.from(players.values()));
          integrationData.tables = Array.from(tables.values());

          return integrationData;
        }
      )
    )
  }

  computePlayersData(players: Player[]): Player[] {

    const computePlayers: Player[] = [];

    players.forEach(player => {
      const playingMatches = player.matches.filter(match => match.status != 'finished');
      player.duplicate = playingMatches.length > 1;
      player.inProgress = playingMatches.filter(match => match.tableNum);
      if (player.inProgress.length > 1) {
        const tables = player.inProgress.map(match => match.tableNum).sort((t1, t2) => (t1 || 0) - (t2 || 0)).join(' - ');
        player.inProgressWarning = player.name + ' sur plusieurs tables: ' + tables;
      }


      player.finishedMatches = player.matches.filter(match => match.status == 'finished').sort((first: Match, second: Match) => {
        if (!first.finishedTime) {
          return 1;
        }
        if (!second.finishedTime) {
          return -1;
        }
        return second.finishedTime.getTime() - first.finishedTime.getTime();
      });

      const finishedMatchesWithoutBlanks = player.finishedMatches.filter(match => !match.blank);

      if (player.inProgress.length == 0) {
        if (finishedMatchesWithoutBlanks.length > 0) {
          const lastFinishedMatches = finishedMatchesWithoutBlanks[0];
          if (lastFinishedMatches.finishedTime) {
            player.pauseSince = lastFinishedMatches.finishedTime;

            const millis = new Date().getTime() - player.pauseSince.getTime()
            player.pauseMinutes = Math.round(millis / 60000);
          } else {
            const playerA = lastFinishedMatches.playerA?.name || lastFinishedMatches.playerAname;
            const playerB = lastFinishedMatches.playerB?.name || lastFinishedMatches.playerBname;
            console.warn('Pas de date de fin pour le match terminé:' + lastFinishedMatches.id + 'du tournoi ' + lastFinishedMatches.tournament + ' entre ' + playerA + ' et ' + playerB);
          }
        }
      }
      player.nbMatchesPlayed = finishedMatchesWithoutBlanks.length;

      computePlayers.push(player);
    });

    return computePlayers;
  }

}
