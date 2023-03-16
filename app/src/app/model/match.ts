import {Player} from 'src/app/model/player';

export class Match {
  id: string = '';
  status: string | undefined;
  blank: boolean = false;
  tournamentId: string | undefined;
  tournament: string | undefined;
  round: string | undefined;
  order: string | undefined;
  tableNum: number | undefined;
  raceTo: number | undefined;
  playerAid: string | undefined;
  playerA: Player | undefined;
  playerAname: string | undefined;
  playerAduplicated: boolean = false;
  playerAtable: number | undefined;
  playerAscore: number = 0;
  playerBid: string | undefined;
  playerB: Player | undefined;
  playerBname: string | undefined;
  playerBscore: number = 0;
  playerBduplicated: boolean = false;
  playerBtable: number | undefined;
  startTime: Date | undefined;
  finishedTime: Date | undefined;
  minutes: number | undefined; // duration
}
