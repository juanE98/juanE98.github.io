import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isAboutInView = false;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollToAbout() {
    const aboutSection = document.getElementById('about');
    const arrowButton = document.querySelector('.arrow-button');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
      if (arrowButton) {
        arrowButton.classList.add('hidden');
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const arrowButton = document.querySelector('.arrow-button');
    if (arrowButton) {
      if (window.scrollY > 0) {
        arrowButton.classList.add('hidden');
      } else {
        arrowButton.classList.remove('hidden');
      }
    }
  }
}
