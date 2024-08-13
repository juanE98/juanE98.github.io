import { Component, HostListener } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'] // Corrected property name
})
export class TimelineComponent {
  readonly events: ReadonlyArray<[string, string, string]> = [
    ['Bachelor of Pharmaceutics and Therapeutic Science', 'University of Queensland - 2018', 'text'],
    ['Bachelor of Computer Science', 'University of Queensland - 2022', 'text'],
    ['2023-03-01', 'Event 3', 'text'],
    ['2023-03-01', 'Event 3', 'text'],
    ['2023-03-01', 'Event 3', 'text'],
    ['2023-03-01', 'Event 3', 'text'],
    ['2023-03-01', 'Event 3', 'text']
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const elements = document.querySelectorAll('.timeline > div');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
      const position = element.getBoundingClientRect().top;
      if (position < windowHeight - 100) {
        element.classList.add('in-view');
      }
    });
  }
}
