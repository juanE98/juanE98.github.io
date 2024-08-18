import { Component, HostListener } from '@angular/core';
import {NgForOf} from "@angular/common";
import {ScrollVisibilityDirective} from "../scroll-visibility.directive";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    NgForOf, ScrollVisibilityDirective
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'] // Corrected property name
})
export class TimelineComponent {
  readonly events: ReadonlyArray<[string, string, string]> = [
    ['Pharmacy Student', 'Calanna Terrywhite - 2018', 'rural pharmacy student placement'],
    ['Bachelor of Pharmaceutics and Therapeutic Science', 'University of Queensland - 2018', ''],
    ['Pharmacy Assistant', 'Chemist Warehouse - 2019', 'Worked in a fast paced environment where time management and communication / customer support skills were vital.'],
    ['Bachelor of Computer Science', 'University of Queensland - 2022', ''],
    ['Scriptsoft', 'Software Developer - 2023', 'Monolithic .NET framework applications for pharmaceutical and small business software.'],
    ['Dye and Durham', 'Junior Software Engineer - Current', 'Primarily .NET microservices with Angular frontend deployed through kubernetes in GCP.'],
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
