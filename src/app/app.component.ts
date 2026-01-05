import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    HeaderComponent,
    RouterOutlet,
    CommonModule,
    AboutComponent,
    TimelineComponent,
    ImageCarouselComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'website-portfolio';
  private scrollTimeout: any;
  private isScrolling = false;
  private isMobile = false;
  private lastScrollTop = 0;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.checkMobile();
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  jumpToSection(section: string | null) {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        // Use different scroll behavior for mobile vs desktop
        const behavior = this.isMobile ? 'auto' : 'smooth';
        element.scrollIntoView({ behavior, block: 'start' });
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Debounce scroll events for better performance
    // Clear any existing timeout to reset the debounce timer
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.isScrolling = true;

    this.scrollTimeout = setTimeout(() => {
      const currentScrollTop = window.scrollY;

      // Prevent scroll bounce at boundaries
      if (this.isMobile) {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;

        // Prevent over-scroll at top
        if (currentScrollTop < 0) {
          window.scrollTo(0, 0);
          this.isScrolling = false;
          return;
        }

        // Prevent over-scroll at bottom
        if (currentScrollTop > maxScroll) {
          window.scrollTo(0, maxScroll);
          this.isScrolling = false;
          return;
        }
      }

      if (currentScrollTop === 0) {
        this.router.navigate([], { fragment: '' });
      }

      this.lastScrollTop = currentScrollTop;
      this.isScrolling = false;
    }, this.isMobile ? 32 : 16); // Slower debouncing on mobile
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.checkMobile();
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}
