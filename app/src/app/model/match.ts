export class Match {
  id: string = '';
  status: string | undefined;
  tableNum: number | undefined;
  playerAid: string | undefined;
  playerAname: string | undefined;
  playerAscore: number = 0;
  playerBid: string | undefined;
  playerBname: string | undefined;
  playerBscore: number = 0;
  startTime: Date | undefined;
  finishedTime: Date | undefined;
}
