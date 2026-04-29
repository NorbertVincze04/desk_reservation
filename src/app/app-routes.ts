import { Routes } from '@angular/router';
import { BookingComponent } from './features/booking/booking.component';
import { InformationComponent } from './features/information/information.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full',
  },
  {
    path: 'booking',
    component: BookingComponent,
  },
  { path: 'info', component: InformationComponent },
  { path: '**', component: NotFoundComponent },
];
