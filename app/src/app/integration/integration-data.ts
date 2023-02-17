import {Match} from 'src/app/model/match';
import {Player} from 'src/app/model/player';
import {Table} from 'src/app/model/table';
import {Tournament} from 'src/app/model/tournament';

export class IntegrationData {

  date: Date  = new Date();
  tournaments: Tournament[] = [];
  tables: Table[] = [];
  matches: Match[] = [];
  players: Player[] = [];
}
