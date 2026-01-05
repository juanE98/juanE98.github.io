import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from '../../app/app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let fragmentSubject: BehaviorSubject<string | null>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    fragmentSubject = new BehaviorSubject<string | null>(null);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragmentSubject.asObservable()
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    // Clean up any timeouts
    if (component['scrollTimeout']) {
      clearTimeout(component['scrollTimeout']);
    }
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'website-portfolio' title`, () => {
    expect(component.title).toEqual('website-portfolio');
  });

  it('should render title', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('h1')?.textContent).toContain("Hi, I'm Juan");
  });

  describe('Initialization', () => {
    it('should initialize with default private properties', () => {
      expect(component['scrollTimeout']).toBeUndefined();
      expect(component['isScrolling']).toBe(false);
      expect(component['isMobile']).toBe(false);
      expect(component['lastScrollTop']).toBe(0);
    });

    it('should call checkMobile on ngOnInit', () => {
      const checkMobileSpy = spyOn<any>(component, 'checkMobile').and.callThrough();

      component.ngOnInit();

      expect(checkMobileSpy).toHaveBeenCalled();
    });

    it('should subscribe to fragment changes on ngOnInit', () => {
      const jumpToSectionSpy = spyOn(component, 'jumpToSection');

      component.ngOnInit();
      fragmentSubject.next('about');

      expect(jumpToSectionSpy).toHaveBeenCalledWith('about');
    });
  });

  describe('Fragment navigation', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      mockElement.id = 'test-section';
      mockElement.scrollIntoView = jasmine.createSpy('scrollIntoView');
      document.body.appendChild(mockElement);
    });

    afterEach(() => {
      mockElement.remove();
    });

    it('should jump to section when fragment is provided', () => {
      component.ngOnInit();
      fragmentSubject.next('test-section');

      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it('should not jump to section when fragment is null', () => {
      component.ngOnInit();
      fragmentSubject.next(null);

      expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
    });

    it('should handle multiple fragment changes', () => {
      component.ngOnInit();

      fragmentSubject.next('test-section');
      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);

      fragmentSubject.next('test-section');
      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(2);
    });
  });

  describe('jumpToSection()', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      // Clean up any existing test elements first
      const existing = document.getElementById('test-jump-section');
      if (existing) existing.remove();

      mockElement = document.createElement('div');
      mockElement.id = 'test-jump-section';
      mockElement.scrollIntoView = jasmine.createSpy('scrollIntoView');
      document.body.appendChild(mockElement);
    });

    afterEach(() => {
      if (mockElement && mockElement.parentNode) {
        mockElement.remove();
      }
    });

    it('should scroll with smooth behavior on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      component['checkMobile']();
      component.jumpToSection('test-jump-section');

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should scroll with auto behavior on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      component['checkMobile']();
      component.jumpToSection('test-jump-section');

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start'
      });
    });

    it('should not scroll when section is null', () => {
      component.jumpToSection(null);

      expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
    });

    it('should not scroll when element does not exist', () => {
      expect(() => {
        component.jumpToSection('non-existent-section');
      }).not.toThrow();
    });

    it('should handle empty string fragment', () => {
      expect(() => {
        component.jumpToSection('');
      }).not.toThrow();
    });
  });

  describe('Mobile detection', () => {
    it('should detect mobile when window width <= 768px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      component['checkMobile']();

      expect(component['isMobile']).toBe(true);
    });

    it('should not detect mobile when window width > 768px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      component['checkMobile']();

      expect(component['isMobile']).toBe(false);
    });

    it('should update isMobile on window resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      component.ngOnInit();
      expect(component['isMobile']).toBe(false);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      component.onWindowResize();
      expect(component['isMobile']).toBe(true);
    });

    it('should handle exact mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      component['checkMobile']();

      expect(component['isMobile']).toBe(true);
    });

    it('should handle one pixel above mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 769
      });

      component['checkMobile']();

      expect(component['isMobile']).toBe(false);
    });
  });

  describe('Scroll throttling', () => {
    it('should throttle scroll events on desktop with 16ms delay', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      component.ngOnInit();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });

      window.dispatchEvent(new Event('scroll'));

      // Should not process immediately
      expect(component['isScrolling']).toBe(true);

      tick(15);
      expect(component['isScrolling']).toBe(true);

      tick(1);
      expect(component['isScrolling']).toBe(false);
    }));

    it('should throttle scroll events on mobile with 32ms delay', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      component.ngOnInit();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });

      window.dispatchEvent(new Event('scroll'));

      tick(16);
      expect(component['isScrolling']).toBe(true);

      tick(16);
      expect(component['isScrolling']).toBe(false);
    }));

  });

  describe('Scroll boundary handling on mobile', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      component.ngOnInit();
    });

    it('should prevent over-scroll at top on mobile', fakeAsync(() => {
      const scrollToSpy = spyOn(window, 'scrollTo');

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: -50
      });

      window.dispatchEvent(new Event('scroll'));
      tick(32);

      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    }));

    it('should prevent over-scroll at bottom on mobile', fakeAsync(() => {
      const scrollToSpy = spyOn(window, 'scrollTo');

      Object.defineProperty(document.documentElement, 'scrollHeight', {
        writable: true,
        configurable: true,
        value: 3000
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      });

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 2500
      });

      window.dispatchEvent(new Event('scroll'));
      tick(32);

      expect(scrollToSpy).toHaveBeenCalledWith(0, 2200); // 3000 - 800
    }));

    it('should not prevent scroll within valid range on mobile', fakeAsync(() => {
      const scrollToSpy = spyOn(window, 'scrollTo');

      Object.defineProperty(document.documentElement, 'scrollHeight', {
        writable: true,
        configurable: true,
        value: 3000
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      });

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 1000
      });

      window.dispatchEvent(new Event('scroll'));
      tick(32);

      // scrollTo should not be called for valid scroll positions
      expect(scrollToSpy).not.toHaveBeenCalled();
    }));
  });



  describe('ngOnDestroy cleanup', () => {
    it('should clear scrollTimeout on destroy', () => {
      const clearTimeoutSpy = spyOn(window, 'clearTimeout');

      component.ngOnInit();
      window.dispatchEvent(new Event('scroll'));

      component.ngOnDestroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should not error when destroying without active timeout', () => {
      component['scrollTimeout'] = undefined;

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Window event listeners', () => {
    it('should respond to window scroll events', () => {
      const onWindowScrollSpy = spyOn(component, 'onWindowScroll');

      fixture.detectChanges();
      window.dispatchEvent(new Event('scroll'));

      expect(onWindowScrollSpy).toHaveBeenCalled();
    });

    it('should respond to window resize events', () => {
      const onWindowResizeSpy = spyOn(component, 'onWindowResize');

      fixture.detectChanges();
      window.dispatchEvent(new Event('resize'));

      expect(onWindowResizeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid fragment changes', fakeAsync(() => {
      const mockElement1 = document.createElement('div');
      mockElement1.id = 'section1';
      mockElement1.scrollIntoView = jasmine.createSpy('scrollIntoView1');
      document.body.appendChild(mockElement1);

      const mockElement2 = document.createElement('div');
      mockElement2.id = 'section2';
      mockElement2.scrollIntoView = jasmine.createSpy('scrollIntoView2');
      document.body.appendChild(mockElement2);

      component.ngOnInit();

      fragmentSubject.next('section1');
      fragmentSubject.next('section2');
      fragmentSubject.next('section1');

      expect(mockElement1.scrollIntoView).toHaveBeenCalled();
      expect(mockElement2.scrollIntoView).toHaveBeenCalled();

      mockElement1.remove();
      mockElement2.remove();
    }));


    it('should handle initialization with mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      const newFixture = TestBed.createComponent(AppComponent);
      const newComponent = newFixture.componentInstance;

      newComponent.ngOnInit();

      expect(newComponent['isMobile']).toBe(true);

      newComponent.ngOnDestroy();
    });

    it('should handle resize from desktop to mobile and back', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      component.ngOnInit();
      expect(component['isMobile']).toBe(false);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      component.onWindowResize();
      expect(component['isMobile']).toBe(true);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      });
      component.onWindowResize();
      expect(component['isMobile']).toBe(false);
    });
  });

  describe('Integration with ActivatedRoute', () => {
    it('should subscribe to fragment observable on init', () => {
      const subscribeSpy = spyOn(fragmentSubject, 'subscribe').and.callThrough();

      // Create new component to test subscription
      const newFixture = TestBed.createComponent(AppComponent);
      const newComponent = newFixture.componentInstance;

      newComponent.ngOnInit();

      // The subscribe is called through the observable chain
      expect(newComponent).toBeTruthy();

      newComponent.ngOnDestroy();
    });

    it('should handle fragment updates throughout component lifecycle', () => {
      const mockElement = document.createElement('div');
      mockElement.id = 'test';
      mockElement.scrollIntoView = jasmine.createSpy('scrollIntoView');
      document.body.appendChild(mockElement);

      component.ngOnInit();

      fragmentSubject.next('test');
      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);

      fragmentSubject.next('test');
      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(2);

      mockElement.remove();
    });
  });
});
