import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from 'src/app/home/home.component';
import {TimerComponent} from 'src/app/timer/timer.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'timer', component: TimerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
