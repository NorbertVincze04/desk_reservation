import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowBoxComponent } from './shadow-box/shadow-box.component';
import { MainDivComponent } from './main-div/main-div.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [ShadowBoxComponent, MainDivComponent, MapComponent],
  imports: [CommonModule],
  exports: [ShadowBoxComponent, MainDivComponent, MapComponent],
})
export class SharedModule {}
