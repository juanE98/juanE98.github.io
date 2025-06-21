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
  events: [string, string, string][] = [
    ['Pharmacy Student', 'Calanna Terrywhite | 2018', 'rural pharmacy student placement'],
    ['Bachelor of Pharmaceutics and Therapeutic Science', 'University of Queensland | 2016 - 2018', ''],
    ['Pharmacy Assistant', 'Chemist Warehouse | 2017 - 2019', 'Worked in a fast paced environment where time management and communication / customer support skills were vital.'],
    ['Bachelor of Computer Science', 'University of Queensland | 2019 - 2022', ''],
    ['Scriptsoft', 'Software Developer | 2022 - 2023', 'Monolithic .NET framework applications for pharmaceutical and small business software. Worked part time during my uni days before transitioning to full time upon graduation.'],
    ['Dye and Durham', 'Junior Software Engineer | 2023 - 2024', 'Primarily .NET microservices with Angular frontend deployed through kubernetes in GCP.'],
    ['Contal Services', 'Backend Software Engineer - Current', 'Java backend with Spring Boot']
  ];

  constructor() {
    this.events.reverse();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const elements = document.querySelectorAll('.timeline-item');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      
      // Only trigger when element is significantly visible (30% of viewport from top)
      const triggerPoint = windowHeight * 0.7;
      
      if (elementTop < triggerPoint && elementBottom > 0) {
        element.classList.add('in-view');
      }
    });
  }
}
