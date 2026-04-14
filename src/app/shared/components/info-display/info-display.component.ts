import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-info-display',
  templateUrl: './info-display.component.html',
  styleUrl: './info-display.component.css',
})
export class InfoDisplayComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() content: TemplateRef<any> | null = null;
  @Input() showDefault: boolean = true;
  @Input() defaultContent: string = 'No information available';
}
