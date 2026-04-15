import { Routes } from '@angular/router';
import { BookingComponent } from './core/pages/booking/booking.component';
import { InformationComponent } from './core/pages/information/information.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';

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
