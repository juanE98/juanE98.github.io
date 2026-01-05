import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScrollVisibilityDirective } from '../../app/scroll-visibility.directive';

@Component({
  template: `
    <div appScrollVisibility>
      <div class="column" style="height: 100px;"></div>
      <div class="column" style="height: 100px;"></div>
      <div class="column" style="height: 100px;"></div>
    </div>
  `,
  standalone: true,
  imports: [ScrollVisibilityDirective]
})
class TestHostComponent {}

@Component({
  template: `
    <div [appScrollVisibility]="customSelector" [visibilityThreshold]="customThreshold">
      <div class="custom-element" style="height: 100px;"></div>
    </div>
  `,
  standalone: true,
  imports: [ScrollVisibilityDirective]
})
class TestHostWithCustomInputsComponent {
  customSelector = '.custom-element';
  customThreshold = 0.5;
}

describe('ScrollVisibilityDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directiveElement: DebugElement;
  let directive: ScrollVisibilityDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TestHostWithCustomInputsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(ScrollVisibilityDirective));
    directive = directiveElement.injector.get(ScrollVisibilityDirective);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any lingering timeouts
    if ((directive as any).scrollTimeout) {
      clearTimeout((directive as any).scrollTimeout);
    }
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should have default visibilityThreshold as 0.3', () => {
      expect(directive.visibilityThreshold).toBe(0.3);
    });
  });

  describe('Custom inputs', () => {
    it('should accept custom selector', () => {
      const customFixture = TestBed.createComponent(TestHostWithCustomInputsComponent);
      const customDirectiveElement = customFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
      const customDirective = customDirectiveElement.injector.get(ScrollVisibilityDirective);
      customFixture.detectChanges();

      expect(customDirective.selector).toBe('.custom-element');
    });

    it('should accept custom visibilityThreshold', () => {
      const customFixture = TestBed.createComponent(TestHostWithCustomInputsComponent);
      const customDirectiveElement = customFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
      const customDirective = customDirectiveElement.injector.get(ScrollVisibilityDirective);
      customFixture.detectChanges();

      expect(customDirective.visibilityThreshold).toBe(0.5);
    });
  });

  describe('Mobile detection', () => {
    it('should detect mobile when window width <= 768px', () => {
      // Mock window.innerWidth before creating component
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      try {
        const mobileFixture = TestBed.createComponent(TestHostComponent);
        const mobileDirectiveElement = mobileFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const mobileDirective = mobileDirectiveElement.injector.get(ScrollVisibilityDirective);
        mobileFixture.detectChanges();

        expect((mobileDirective as any).isMobile).toBe(true);
      } finally {
        // Restore original value
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
      }
    });

    it('should not detect mobile when window width > 768px', () => {
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      try {
        const desktopFixture = TestBed.createComponent(TestHostComponent);
        const desktopDirectiveElement = desktopFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const desktopDirective = desktopDirectiveElement.injector.get(ScrollVisibilityDirective);
        desktopFixture.detectChanges();

        expect((desktopDirective as any).isMobile).toBe(false);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
      }
    });

    it('should update isMobile on window resize', () => {
      const originalInnerWidth = window.innerWidth;

      try {
        // Start with desktop
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        const resizeFixture = TestBed.createComponent(TestHostComponent);
        const resizeDirectiveElement = resizeFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const resizeDirective = resizeDirectiveElement.injector.get(ScrollVisibilityDirective);
        resizeFixture.detectChanges();

        expect((resizeDirective as any).isMobile).toBe(false);

        // Resize to mobile
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375
        });

        window.dispatchEvent(new Event('resize'));
        expect((resizeDirective as any).isMobile).toBe(true);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
      }
    });
  });

  describe('In-view and out-of-view class handling', () => {

    it('should add in-view class when element becomes visible on desktop', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        // Set to desktop
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        const newDirectiveElement = newFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const newDirective = newDirectiveElement.injector.get(ScrollVisibilityDirective);
        newFixture.detectChanges();

        const columns = newFixture.nativeElement.querySelectorAll('.column');
        const firstColumn = columns[0];

        // Mock getBoundingClientRect to simulate element in viewport
        spyOn(firstColumn, 'getBoundingClientRect').and.returnValue({
          top: 100,
          bottom: 200,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: 100,
          toJSON: () => {}
        } as DOMRect);

        // Trigger scroll
        window.dispatchEvent(new Event('scroll'));
        tick(16);

        expect(firstColumn.classList.contains('in-view')).toBe(true);
        expect(firstColumn.classList.contains('out-of-view')).toBe(false);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));

    it('should add out-of-view class when element leaves viewport on desktop', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        const newDirectiveElement = newFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const newDirective = newDirectiveElement.injector.get(ScrollVisibilityDirective);
        newFixture.detectChanges();

        const columns = newFixture.nativeElement.querySelectorAll('.column');
        const firstColumn = columns[0];

        // First, make element visible
        const visibleRect = {
          top: 100,
          bottom: 200,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: 100,
          toJSON: () => {}
        } as DOMRect;

        const rectSpy = spyOn(firstColumn, 'getBoundingClientRect').and.returnValue(visibleRect);

        window.dispatchEvent(new Event('scroll'));
        tick(16);

        expect(firstColumn.classList.contains('in-view')).toBe(true);

        // Now move element out of viewport
        rectSpy.and.returnValue({
          top: -200,
          bottom: -100,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: -200,
          toJSON: () => {}
        } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        tick(16);

        expect(firstColumn.classList.contains('in-view')).toBe(false);
        expect(firstColumn.classList.contains('out-of-view')).toBe(true);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));

    it('should respect visibilityThreshold when determining visibility', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 100
        });

        const customFixture = TestBed.createComponent(TestHostWithCustomInputsComponent);
        customFixture.componentInstance.customThreshold = 0.5;
        customFixture.detectChanges();

        const element = customFixture.nativeElement.querySelector('.custom-element');

        // Element is 40% visible (less than 50% threshold)
        spyOn(element, 'getBoundingClientRect').and.returnValue({
          top: 60,
          bottom: 100,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: 60,
          toJSON: () => {}
        } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        tick(16);

        // Should not be considered in view (only 40% visible, threshold is 50%)
        expect(element.classList.contains('in-view')).toBe(false);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));
  });

  describe('Scroll throttling', () => {
    it('should throttle scroll events on desktop with 16ms delay', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        const newDirectiveElement = newFixture.debugElement.query(By.directive(ScrollVisibilityDirective));
        const newDirective = newDirectiveElement.injector.get(ScrollVisibilityDirective);
        newFixture.detectChanges();

        const checkVisibilitySpy = spyOn<any>(newDirective, 'checkVisibility').and.callThrough();

        window.dispatchEvent(new Event('scroll'));

        // Should not call checkVisibility immediately
        expect(checkVisibilitySpy).not.toHaveBeenCalled();

        // Should call after 16ms
        tick(16);
        expect(checkVisibilitySpy).toHaveBeenCalledTimes(1);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
      }
    }));

    it('should throttle scroll events on mobile with 32ms delay', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        const newDirective = newFixture.debugElement.query(By.directive(ScrollVisibilityDirective)).injector.get(ScrollVisibilityDirective);
        newFixture.detectChanges();

        const checkVisibilitySpy = spyOn<any>(newDirective, 'checkVisibility').and.callThrough();

        window.dispatchEvent(new Event('scroll'));

        // Should not call after 16ms
        tick(16);
        expect(checkVisibilitySpy).not.toHaveBeenCalled();

        // Should call after 32ms
        tick(16);
        expect(checkVisibilitySpy).toHaveBeenCalledTimes(1);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
      }
    }));


    it('should clear previous timeout when new scroll event occurs', fakeAsync(() => {
      const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();

      window.dispatchEvent(new Event('scroll'));
      tick(8);
      window.dispatchEvent(new Event('scroll'));
      tick(16);

      expect(clearTimeoutSpy).toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy cleanup', () => {
    it('should clear scrollTimeout on destroy', () => {
      const clearTimeoutSpy = spyOn(window, 'clearTimeout');

      // Set a timeout
      window.dispatchEvent(new Event('scroll'));

      // Destroy directive
      directive.ngOnDestroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should not error when destroying without active timeout', () => {
      (directive as any).scrollTimeout = null;

      expect(() => {
        directive.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle elements with zero height', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        newFixture.detectChanges();

        const columns = newFixture.nativeElement.querySelectorAll('.column');
        const firstColumn = columns[0];

        spyOn(firstColumn, 'getBoundingClientRect').and.returnValue({
          top: 100,
          bottom: 100,
          height: 0,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: 100,
          toJSON: () => {}
        } as DOMRect);

        expect(() => {
          window.dispatchEvent(new Event('scroll'));
          tick(16);
        }).not.toThrow();
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));

    it('should handle elements completely above viewport', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        newFixture.detectChanges();

        const columns = newFixture.nativeElement.querySelectorAll('.column');
        const firstColumn = columns[0];

        spyOn(firstColumn, 'getBoundingClientRect').and.returnValue({
          top: -200,
          bottom: -100,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: -200,
          toJSON: () => {}
        } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        tick(16);

        expect(firstColumn.classList.contains('in-view')).toBe(false);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));

    it('should handle elements completely below viewport', fakeAsync(() => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      try {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800
        });

        const newFixture = TestBed.createComponent(TestHostComponent);
        newFixture.detectChanges();

        const columns = newFixture.nativeElement.querySelectorAll('.column');
        const firstColumn = columns[0];

        spyOn(firstColumn, 'getBoundingClientRect').and.returnValue({
          top: 900,
          bottom: 1000,
          height: 100,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: 900,
          toJSON: () => {}
        } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        tick(16);

        expect(firstColumn.classList.contains('in-view')).toBe(false);
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: originalInnerHeight
        });
      }
    }));
  });
});
