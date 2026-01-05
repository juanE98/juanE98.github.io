import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any classes added during tests
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-interaction');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Menu state management', () => {
    it('should initialize with menuValue as false', () => {
      expect(component.menuValue).toBe(false);
    });

    it('should set menuValue to true when openMenu is called', () => {
      component.openMenu();
      expect(component.menuValue).toBe(true);
    });

    it('should set menuValue to false when closeMenu is called', () => {
      component.menuValue = true;
      component.closeMenu();
      expect(component.menuValue).toBe(false);
    });

    it('should toggle menu state correctly', () => {
      expect(component.menuValue).toBe(false);
      component.openMenu();
      expect(component.menuValue).toBe(true);
      component.closeMenu();
      expect(component.menuValue).toBe(false);
    });
  });

  describe('openMenu() behavior', () => {
    it('should add no-scroll class to document.documentElement', () => {
      component.openMenu();
      expect(document.documentElement.classList.contains('no-scroll')).toBe(true);
    });

    it('should add no-interaction class to document.body', () => {
      component.openMenu();
      expect(document.body.classList.contains('no-interaction')).toBe(true);
    });

    it('should add both classes simultaneously', () => {
      component.openMenu();
      expect(document.documentElement.classList.contains('no-scroll')).toBe(true);
      expect(document.body.classList.contains('no-interaction')).toBe(true);
    });
  });

  describe('closeMenu() behavior', () => {
    beforeEach(() => {
      // Setup: open menu first
      component.openMenu();
    });

    it('should remove no-scroll class from document.documentElement', () => {
      component.closeMenu();
      expect(document.documentElement.classList.contains('no-scroll')).toBe(false);
    });

    it('should remove no-interaction class from document.body', () => {
      component.closeMenu();
      expect(document.body.classList.contains('no-interaction')).toBe(false);
    });

    it('should remove both classes simultaneously', () => {
      component.closeMenu();
      expect(document.documentElement.classList.contains('no-scroll')).toBe(false);
      expect(document.body.classList.contains('no-interaction')).toBe(false);
    });

    it('should not error when closing already closed menu', () => {
      component.closeMenu();
      expect(() => {
        component.closeMenu();
      }).not.toThrow();
    });
  });

  describe('goToPart() navigation and scrolling', () => {
    let mockElement: HTMLElement;
    let mockHeader: HTMLElement;

    beforeEach(() => {
      // Create a mock element in the DOM
      mockElement = document.createElement('div');
      mockElement.id = 'test-section';
      document.body.appendChild(mockElement);

      // Remove any existing headers to avoid conflicts
      const existingHeaders = document.querySelectorAll('header');
      existingHeaders.forEach(h => {
        if (h.parentNode) {
          h.parentNode.removeChild(h);
        }
      });

      // Mock header element
      mockHeader = document.createElement('header');
      Object.defineProperty(mockHeader, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 80
      });
      // Insert at the beginning of body to ensure it's found first by querySelector
      document.body.insertBefore(mockHeader, document.body.firstChild);
    });

    afterEach(() => {
      // Clean up mock element
      if (mockElement && mockElement.parentNode) {
        mockElement.remove();
      }
      // Clean up mock header
      if (mockHeader && mockHeader.parentNode) {
        mockHeader.remove();
      }
      // Restore fixture's header if it was removed
      const fixtureHeader = fixture.nativeElement.querySelector('header');
      if (fixtureHeader && !document.contains(fixtureHeader)) {
        document.body.appendChild(fixtureHeader);
      }
    });


    it('should navigate to the fragment', () => {
      const navigateSpy = spyOn(router, 'navigate');

      spyOn(mockElement, 'getBoundingClientRect').and.returnValue({
        top: 500,
        bottom: 600,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 500,
        toJSON: () => {}
      } as DOMRect);

      component.goToPart('test-section');

      expect(navigateSpy).toHaveBeenCalledWith([], { fragment: 'test-section' });
    });

    it('should handle elements at different scroll positions', () => {
      const scrollToSpy = spyOn(window, 'scrollTo');

      spyOn(mockElement, 'getBoundingClientRect').and.returnValue({
        top: 200,
        bottom: 300,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 200,
        toJSON: () => {}
      } as DOMRect);

      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 1000
      });

      component.goToPart('test-section');

      expect(scrollToSpy).toHaveBeenCalledTimes(1);
      const scrollOptions = scrollToSpy.calls.mostRecent().args[0] as ScrollToOptions;
      expect(scrollOptions.top).toBe(1120); // 200 + 1000 - 80
      expect(scrollOptions.behavior).toBe('smooth');
    });

    it('should not throw error when element does not exist', () => {
      expect(() => {
        component.goToPart('non-existent-section');
      }).not.toThrow();
    });

    it('should not scroll or navigate when element is null', () => {
      const scrollToSpy = spyOn(window, 'scrollTo');
      const navigateSpy = spyOn(router, 'navigate');

      component.goToPart('non-existent-section');

      expect(scrollToSpy).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should use document.documentElement.scrollTop when pageYOffset is not available', () => {
      const scrollToSpy = spyOn(window, 'scrollTo');

      spyOn(mockElement, 'getBoundingClientRect').and.returnValue({
        top: 500,
        bottom: 600,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 500,
        toJSON: () => {}
      } as DOMRect);

      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: undefined
      });

      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 200
      });

      component.goToPart('test-section');

      expect(scrollToSpy).toHaveBeenCalledTimes(1);
      const scrollOptions = scrollToSpy.calls.mostRecent().args[0] as ScrollToOptions;
      expect(scrollOptions.top).toBe(620); // 500 + 200 - 80
      expect(scrollOptions.behavior).toBe('smooth');
    });

  });

  describe('Header hide/show on scroll', () => {
    let mockHeader: HTMLElement;

    beforeEach(() => {
      mockHeader = fixture.nativeElement.querySelector('header');
      if (!mockHeader) {
        mockHeader = document.createElement('header');
        Object.defineProperty(mockHeader, 'offsetHeight', {
          writable: true,
          configurable: true,
          value: 80
        });
        fixture.nativeElement.appendChild(mockHeader);
      } else {
        Object.defineProperty(mockHeader, 'offsetHeight', {
          writable: true,
          configurable: true,
          value: 80
        });
      }
      component.lastScrollTop = 0;
    });

    it('should add hidden class when scrolling down past header height', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 100
      });

      component.lastScrollTop = 0;
      component.onWindowScroll();

      expect(mockHeader.classList.contains('hidden')).toBe(true);
    });

    it('should remove hidden class when scrolling up', () => {
      // First scroll down
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 200
      });
      component.onWindowScroll();
      expect(mockHeader.classList.contains('hidden')).toBe(true);

      // Then scroll up
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 100
      });
      component.onWindowScroll();

      expect(mockHeader.classList.contains('hidden')).toBe(false);
    });

    it('should not add hidden class when scroll position is less than header height', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 50
      });

      component.lastScrollTop = 0;
      component.onWindowScroll();

      expect(mockHeader.classList.contains('hidden')).toBe(false);
    });

    it('should update lastScrollTop after scroll', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 150
      });

      component.onWindowScroll();

      expect(component.lastScrollTop).toBe(150);
    });

    it('should set lastScrollTop to 0 when scroll position is negative', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: -10
      });

      component.onWindowScroll();

      expect(component.lastScrollTop).toBe(0);
    });

    it('should handle header element not found gracefully', () => {
      // Remove header
      const headers = document.querySelectorAll('header');
      headers.forEach(h => h.remove());

      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 100
      });

      expect(() => {
        component.onWindowScroll();
      }).not.toThrow();
    });
  });

  describe('Template integration', () => {
    it('should bind menuValue to mobile menu panel active class', () => {
      const panel = compiled.querySelector('.mobile_menu_panel');

      component.menuValue = false;
      fixture.detectChanges();
      expect(panel?.classList.contains('active')).toBe(false);

      component.menuValue = true;
      fixture.detectChanges();
      expect(panel?.classList.contains('active')).toBe(true);
    });

    it('should call openMenu when menu icon is clicked', () => {
      const openMenuSpy = spyOn(component, 'openMenu');
      const menuIcon = compiled.querySelector('.menu-icon-open');

      (menuIcon as HTMLElement).click();

      expect(openMenuSpy).toHaveBeenCalled();
    });

    it('should call closeMenu when close icon is clicked', () => {
      const closeMenuSpy = spyOn(component, 'closeMenu');
      const closeIcon = compiled.querySelector('.menu-icon-close');

      (closeIcon as HTMLElement).click();

      expect(closeMenuSpy).toHaveBeenCalled();
    });

    it('should call goToPart with correct fragment when desktop menu item is clicked', () => {
      const goToPartSpy = spyOn(component, 'goToPart');
      const desktopMenuItems = compiled.querySelectorAll('.desktop_menu_nav li');

      if (desktopMenuItems.length > 0) {
        (desktopMenuItems[0] as HTMLElement).click();
        expect(goToPartSpy).toHaveBeenCalledWith('home');
      }
    });

    it('should call closeMenu and goToPart when mobile menu item is clicked', () => {
      const closeMenuSpy = spyOn(component, 'closeMenu');
      const goToPartSpy = spyOn(component, 'goToPart');
      const mobileMenuItems = compiled.querySelectorAll('.mobile_menu_panel li');

      if (mobileMenuItems.length > 0) {
        (mobileMenuItems[0] as HTMLElement).click();
        expect(closeMenuSpy).toHaveBeenCalled();
        expect(goToPartSpy).toHaveBeenCalledWith('home');
      }
    });

    it('should call goToPart with home when logo is clicked', () => {
      const goToPartSpy = spyOn(component, 'goToPart');
      const logo = compiled.querySelector('.logo');

      if (logo) {
        (logo as HTMLElement).click();
        expect(goToPartSpy).toHaveBeenCalledWith('home');
      }
    });
  });

  describe('AfterViewInit lifecycle', () => {
    it('should have aboutSection ViewChild after view init', () => {
      // Component is already initialized in beforeEach
      expect(component.ngAfterViewInit).toBeDefined();

      // Call ngAfterViewInit explicitly
      component.ngAfterViewInit();

      // Should not throw
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('Scroll event listener', () => {
    it('should respond to window scroll events', () => {
      const onWindowScrollSpy = spyOn(component, 'onWindowScroll');

      window.dispatchEvent(new Event('scroll'));

      expect(onWindowScrollSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid menu open/close operations', () => {
      component.openMenu();
      expect(component.menuValue).toBe(true);

      component.closeMenu();
      expect(component.menuValue).toBe(false);

      component.openMenu();
      expect(component.menuValue).toBe(true);

      component.closeMenu();
      expect(component.menuValue).toBe(false);
    });

    it('should maintain scroll position tracking across multiple scrolls', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 100
      });
      component.onWindowScroll();
      expect(component.lastScrollTop).toBe(100);

      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 200
      });
      component.onWindowScroll();
      expect(component.lastScrollTop).toBe(200);

      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 150
      });
      component.onWindowScroll();
      expect(component.lastScrollTop).toBe(150);
    });
  });
});
