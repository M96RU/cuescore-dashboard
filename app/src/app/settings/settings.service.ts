import {Injectable} from '@angular/core';
import {Settings} from 'src/app/settings/settings';

@Injectable()
export class SettingsService {
  constructor() {
  }

  private getSettings(): Settings {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      return JSON.parse(settingsString)
    } else {
      return new Settings();
    }
  }

  private saveSettings(settings: Settings): void {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  getTournaments(): string[] {
    // const tournaments: string[] = [];
    // const joinedTournaments = localStorage.getItem('tournaments');
    // if (joinedTournaments) {
    //   joinedTournaments.split('#').forEach(id => {
    //     tournaments.push(id);
    //   });
    // }
    return this.getSettings().tournaments;
  }

  addTournamentId(tournamentId: string): void {
    const settings = this.getSettings()
    // const tournaments = this.getTournaments();
    const exists = settings.tournaments.find(current => current == tournamentId);
    if (!exists) {
      settings.tournaments.push(tournamentId);
      // localStorage.setItem('tournaments', tournaments.join('#'));
      this.saveSettings(settings);
    }
  }

  removeTournamentId(tournamentId: string): void {
    const settings = this.getSettings()
    // const tournaments = this.getTournaments();
    settings.tournaments = settings.tournaments.filter(id => id != tournamentId);
    this.saveSettings(settings);
    // if (tournamentsWithoutOneToRemove.length > 0) {
    //   localStorage.setItem('tournaments', tournamentsWithoutOneToRemove.join('#'));
    // } else {
    //   localStorage.removeItem('tournaments');
    // }
    //
  }

}
