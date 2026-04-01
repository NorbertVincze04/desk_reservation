import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { DatePickerModule } from 'primeng/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app-routes';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { InformationComponent } from './information/information.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CalendarComponent } from './booking/calendar/calendar.component';
import { TableComponent } from './information/table/table.component';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MockInterceptService } from './core/mock-intercept.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    BookingComponent,
    InformationComponent,
    CalendarComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
      translation: {
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
