import { Component, Renderer2, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  menuValue: boolean = false;
  menu_icon: string = "bi bi-list";
  lastScrollTop: number = 0;

  @ViewChild('aboutSection') aboutSection!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Ensure aboutSection is available after view initialization
  }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? "bi bi-x" : "bi bi-list";
    if (this.menuValue) {
      this.renderer.addClass(document.documentElement, 'no-scroll'); // Apply to html element
      this.renderer.addClass(document.body, 'no-interaction');
      this.renderer.addClass(document.querySelector('.mobile-menu-container'), 'interactable');
    } else {
      this.renderer.removeClass(document.documentElement, 'no-scroll'); // Remove from html element
      this.renderer.removeClass(document.body, 'no-interaction');
      this.renderer.removeClass(document.querySelector('.mobile-menu-container'), 'interactable');
    }
  }

  closeMenu() {
    this.menuValue = false;
    this.menu_icon = "bi bi-list";
    this.renderer.removeClass(document.documentElement, 'no-scroll'); // Remove from html element
    this.renderer.removeClass(document.body, 'no-interaction');
    this.renderer.removeClass(document.querySelector('.mobile-menu-container'), 'interactable');
  }

  goToPart(fragment: string) {
    this.router.navigate(['/'], { fragment }).then(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      this.renderer.addClass(document.querySelector('header'), 'hidden');
    } else {
      this.renderer.removeClass(document.querySelector('header'), 'hidden');
    }
    this.lastScrollTop = st <= 0 ? 0 : st;

    // Check if about section is in view
    const aboutPosition = this.aboutSection.nativeElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (aboutPosition < windowHeight && aboutPosition >= 0) {
      this.closeMenu();
    }
  }

  onMenuIconFade() {
    this.closeMenu();
  }
}
