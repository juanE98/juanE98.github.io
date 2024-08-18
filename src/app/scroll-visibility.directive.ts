import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollVisibility]',
  standalone: true
})
export class ScrollVisibilityDirective {
  @Input('appScrollVisibility') selector: string = '.column';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = this.el.nativeElement;
    const columns = element.querySelectorAll(this.selector);
    const windowHeight = window.innerHeight;

    if (element) {
      const position = element.getBoundingClientRect().top;
      if (position < windowHeight - 100 && position > -element.clientHeight) {
        columns.forEach((column: HTMLElement) => {
          this.renderer.addClass(column, 'in-view');
          this.renderer.removeClass(column, 'out-of-view');
        });
      } else {
        columns.forEach((column: HTMLElement) => {
          this.renderer.removeClass(column, 'in-view');
          this.renderer.addClass(column, 'out-of-view');
        });
      }
    }
  }
}
