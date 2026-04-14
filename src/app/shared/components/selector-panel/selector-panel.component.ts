import { Component, Input, TemplateRef } from '@angular/core';

export interface SelectorConfig {
  title: string;
  description?: string;
}

@Component({
  selector: 'app-selector-panel',
  templateUrl: './selector-panel.component.html',
  styleUrl: './selector-panel.component.css',
})
export class SelectorPanelComponent {
  @Input() config: SelectorConfig = { title: 'Selection' };
  @Input() content!: TemplateRef<any>;
  @Input() footer?: TemplateRef<any>;
  @Input() showBorder: boolean = true;
  @Input() customClass: string = '';
}
