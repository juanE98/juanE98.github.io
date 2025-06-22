import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollVisibility]',
  standalone: true
})
export class ScrollVisibilityDirective implements OnInit, OnDestroy {
  @Input('appScrollVisibility') selector: string = '.column';
  private animatedElements: Set<HTMLElement> = new Set();
  private scrollTimeout: any;
  private isScrolling = false;
  private isMobile = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Check if we're on mobile
    this.isMobile = window.innerWidth <= 768;
    
    // Initial check in case elements are already in view on load
    this.checkVisibility();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Enhanced throttling for mobile performance
    if (this.isScrolling) return;
    
    this.isScrolling = true;
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    const delay = this.isMobile ? 32 : 16; // Slower on mobile for better performance
    
    this.scrollTimeout = setTimeout(() => {
      this.checkVisibility();
      this.isScrolling = false;
    }, delay);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  private checkVisibility() {
    const parentElement = this.el.nativeElement;
    const columns = parentElement.querySelectorAll(this.selector);
    const windowHeight = window.innerHeight;

    columns.forEach((column: HTMLElement) => {
      if (this.animatedElements.has(column)) {
        return; // Already animated, do nothing
      }

      const position = column.getBoundingClientRect().top;
      // Check if the top of the column is within the viewport (or slightly above)
      // and if the bottom of the column is also within the viewport (or slightly below)
      const columnHeight = column.offsetHeight;
      const buffer = 50; // A small buffer to trigger a bit earlier/later

      if (position < windowHeight - buffer && (position + columnHeight) > buffer) {
        this.renderer.addClass(column, 'in-view');
        this.renderer.removeClass(column, 'out-of-view'); // Ensure out-of-view is removed
        this.animatedElements.add(column);
      }
      // No 'else' block to remove 'in-view' or add 'out-of-view' if we only want to animate once
    });
  }
}
