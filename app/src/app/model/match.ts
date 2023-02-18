export class Match {
  id: string = '';
  status: string | undefined;
  tournament: string | undefined;
  round: string | undefined;
  order: string | undefined;
  tableNum: number | undefined;
  playerAid: string | undefined;
  playerAname: string | undefined;
  playerAduplicated: boolean = false;
  playerAscore: number = 0;
  playerBid: string | undefined;
  playerBname: string | undefined;
  playerBscore: number = 0;
  playerBduplicated: boolean = false;
  startTime: Date | undefined;
  finishedTime: Date | undefined;
}
