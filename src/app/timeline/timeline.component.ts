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
    ['Pharmacy Student', 'Calanna Terrywhite Townsville - 2018', 'rural pharmacy student placement'],
    ['Pharmacy Assitant', 'Chemist Warehouse Carseldine - 2019', 'Worked in a fast paced environment where time management and communication / customer support skills were vital.'],
    ['Bachelor of Pharmaceutics and Therapeutic Science', 'University of Queensland - 2018', 'text'],
    ['Bachelor of Computer Science', 'University of Queensland | 2022', 'text'],
    ['Scriptsoft', 'Software Developer - 2023', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies aliquam. lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies aliquam.'],
    ['Dye and Durham', 'Junior Software Engineer - Current', 'text'],
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
