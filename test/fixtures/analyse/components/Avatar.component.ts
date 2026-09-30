import { Component, Input } from '@angular/core';

@Component({ selector: 'app-avatar', template: '<img [src]="src" />' })
export class AvatarComponent {
  @Input() src = '';
  @Input() size = 32;
}
