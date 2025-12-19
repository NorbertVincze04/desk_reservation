import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowBoxComponent } from './shadow-box/shadow-box.component';
import { MainDivComponent } from './main-div/main-div.component';

@NgModule({
  declarations: [ShadowBoxComponent, MainDivComponent],
  imports: [CommonModule],
  exports: [ShadowBoxComponent, MainDivComponent],
})
export class SharedModule {}
