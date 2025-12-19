import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowBoxComponent } from './shadow-box/shadow-box.component';

@NgModule({
  declarations: [ShadowBoxComponent],
  imports: [CommonModule],
  exports: [ShadowBoxComponent],
})
export class SharedModule {}
