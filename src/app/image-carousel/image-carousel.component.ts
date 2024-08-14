import {Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss'
})
export class ImageCarouselComponent implements OnInit {
  icons: string[] = [];

  ngOnInit() {
    this.icons = this.generateIconPaths(5, 20);
    this.icons = [...this.icons, ...this.icons];
    console.log(this.icons);

  }

  generateIconPaths(start: number, end: number): string[] {
    const paths: string[] = [];
    for (let i = start; i <= end; i++) {
      paths.push(`assets/icons/${i}.svg`);
    }
    return paths;
  }
}
