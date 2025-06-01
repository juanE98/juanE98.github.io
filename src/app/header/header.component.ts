import { Component, Renderer2, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    // NgClass might not be needed anymore if we use a direct [class.active] binding for the panel
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  menuValue: boolean = false;
  lastScrollTop: number = 0;

  @ViewChild('aboutSection') aboutSection!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Ensure aboutSection is available after view initialization
  }

  openMenu() {
    this.menuValue = true;
    this.renderer.addClass(document.documentElement, 'no-scroll');
    this.renderer.addClass(document.body, 'no-interaction');
    // No need to add interactable to mobile-menu-container if it's gone
  }

  closeMenu() {
    this.menuValue = false;
    this.renderer.removeClass(document.documentElement, 'no-scroll');
    this.renderer.removeClass(document.body, 'no-interaction');
  }

  goToPart(fragment: string) {
    // closeMenu() is now called directly from the template on item click
    const element = document.getElementById(fragment);
    if (element) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const elementRect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = elementRect.top + scrollTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      this.router.navigate([], { fragment });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = document.documentElement.scrollTop;
    const headerElement = document.querySelector('header');
    if (headerElement) {
      if (st > this.lastScrollTop && st > headerElement.offsetHeight) {
        this.renderer.addClass(headerElement, 'hidden');
      } else {
        this.renderer.removeClass(headerElement, 'hidden');
      }
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
}
