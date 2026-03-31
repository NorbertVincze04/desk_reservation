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
import { HeaderComponent } from './header/header.component';
import { InformationComponent } from './information/information.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TableComponent } from './table/table.component';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MockInterceptService } from './mock-intercept.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    BookingComponent,
    HeaderComponent,
    TopBarComponent,
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
