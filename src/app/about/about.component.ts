import { Component } from '@angular/core';
import { ScrollVisibilityDirective } from '../scroll-visibility.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollVisibilityDirective],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {}
