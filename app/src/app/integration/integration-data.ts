import {Player} from 'src/app/model/player';
import {Tournament} from 'src/app/model/tournament';

export class IntegrationData {

  constructor() {
    this.date = new Date()
    this.tournaments = [];
    this.players = [];
  }

  date: Date;
  tournaments: Tournament[];
  players: Player[];
}
