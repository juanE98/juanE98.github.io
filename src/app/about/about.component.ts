import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = document.querySelector('.about-container');
    const columns = document.querySelectorAll('.column');
    const windowHeight = window.innerHeight;

    if (element) {
      const position = element.getBoundingClientRect().top;
      if (position < windowHeight - 100 && position > -element.clientHeight) {
        columns.forEach(column => {
          column.classList.add('in-view');
          column.classList.remove('out-of-view');
        });
      } else {
        columns.forEach(column => {
          column.classList.remove('in-view');
          column.classList.add('out-of-view');
        });
      }
    }
  }
}
