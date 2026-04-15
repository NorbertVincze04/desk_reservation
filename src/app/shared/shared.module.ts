import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowBoxComponent } from './ui-wrappers/shadow-box/shadow-box.component';
import { MainDivComponent } from './ui-wrappers/main-div/main-div.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { ErrorNotificationComponent } from './components/error-notification/error-notification.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app-routes';
import { CalendarComponent } from './calendar/calendar.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    ShadowBoxComponent,
    MainDivComponent,
    MapComponent,
    HeaderComponent,
    TopBarComponent,
    ActionButtonComponent,
    ErrorNotificationComponent,
    CalendarComponent,
    TableComponent,
  ],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [
    ShadowBoxComponent,
    MainDivComponent,
    MapComponent,
    HeaderComponent,
    TopBarComponent,
    ActionButtonComponent,
    ErrorNotificationComponent,
    CalendarComponent,
    TableComponent,
  ],
})
export class SharedModule {}
