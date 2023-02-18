import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IntegrationData} from 'src/app/integration/integration-data';
import {TournamentService} from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  @Output()
  launchIntegration = new EventEmitter<boolean>();

  @Input()
  data: IntegrationData | undefined;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private tournamentService: TournamentService
  ) {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

    if (this.form.valid) {
      const formRawValue = this.form.getRawValue()
      this.tournamentService.getCuescoreTournament(formRawValue.id).subscribe({
        next: response => {
          if (response.tournamentId) {
            this.tournamentService.addTournamentId(response.tournamentId);
            this.form.reset();
            this.launchIntegration.emit(true);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }
}
