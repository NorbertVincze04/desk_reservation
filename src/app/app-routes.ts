import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { BookingComponent } from './booking/booking.component';
import { InformationComponent } from './information/information.component';

export const routes: Routes = [
  { path: '', component: BookingComponent },
  { path: 'info', component: InformationComponent },
  { path: '**', component: NotFoundComponent },
];
