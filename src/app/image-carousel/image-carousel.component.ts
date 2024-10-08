import {Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {ScrollVisibilityDirective} from "../scroll-visibility.directive";

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    ScrollVisibilityDirective
  ],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss'
})
export class ImageCarouselComponent implements OnInit {
  icons: string[] = [];

  ngOnInit() {
    this.icons = this.generateIconPaths(5, 20);
    this.icons = [...this.icons, ...this.icons]; // Duplicate the icons array
  }

  generateIconPaths(start: number, end: number): string[] {
    const paths: string[] = [];
    for (let i = start; i <= end; i++) {
      paths.push(`assets/icons/${i}.svg`);
    }
    return paths;
  }
}
