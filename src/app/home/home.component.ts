import {Component, HostListener} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isAboutInView = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      this.isAboutInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    }
  }

  scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
