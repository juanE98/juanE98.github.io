import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollVisibility]',
  standalone: true
})
export class ScrollVisibilityDirective implements OnInit, OnDestroy {
  @Input('appScrollVisibility') selector: string = '.column';
  @Input() visibilityThreshold: number = 0.3; // Element must be 30% visible to trigger
  private visibleElements: Set<HTMLElement> = new Set();
  private scrollTimeout: any;
  private isScrolling = false;
  private isMobile = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    this.checkVisibility();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isScrolling) return;

    this.isScrolling = true;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    const delay = this.isMobile ? 32 : 16;

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
    // Skip bidirectional animations on mobile
    if (this.isMobile) {
      return;
    }

    const parentElement = this.el.nativeElement;
    const elements = parentElement.querySelectorAll(this.selector);
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;

      // Calculate how much of the element is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / elementHeight;

      const isInView = visibleRatio >= this.visibilityThreshold;
      const wasInView = this.visibleElements.has(element);

      if (isInView && !wasInView) {
        // Element entering viewport
        this.renderer.removeClass(element, 'out-of-view');
        this.renderer.addClass(element, 'in-view');
        this.visibleElements.add(element);
      } else if (!isInView && wasInView) {
        // Element leaving viewport
        this.renderer.removeClass(element, 'in-view');
        this.renderer.addClass(element, 'out-of-view');
        this.visibleElements.delete(element);
      }
    });
  }
}
