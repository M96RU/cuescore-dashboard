import {Match} from 'src/app/model/match';

export class Player {
  id: string = "";
  name: string = "";

  matches: Match[] = [];

  // Compute from integration data
  duplicate = false;
  inProgress: Match[] = [];
  inProgressWarning: string | undefined;
  finishedMatches: Match[] = [];
  pauseSince: Date | undefined;
  pauseMinutes: number | undefined;
  nbMatchesPlayed: number = 0
}
