import {Player} from 'src/app/model/player';

export class Match {
  id: string = "";
  tableId: string | undefined
  playerAid: string | undefined
  playerAscore: number = 0
  playerBid: string | undefined
  playerBscore: number = 0
}
