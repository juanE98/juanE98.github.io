import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ScrollVisibilityDirective} from "../scroll-visibility.directive";

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [
    NgForOf,
    ScrollVisibilityDirective
  ],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss'
})
export class ImageCarouselComponent implements OnInit {
  icons: string[] = [];
  allIcons: string[] = [];

  ngOnInit() {
    this.icons = this.generateIconPaths(5, 20);
    // Create enough copies for seamless scroll
    this.allIcons = [...this.icons, ...this.icons, ...this.icons];
    console.log('Icons:', this.icons);
    console.log('All icons:', this.allIcons);
  }

  generateIconPaths(start: number, end: number): string[] {
    const paths: string[] = [];
    for (let i = start; i <= end; i++) {
      paths.push(`assets/icons/${i}.svg`);
    }
    return paths;
  }
}
