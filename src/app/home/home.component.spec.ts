import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    // Clean up any intervals
    if (component['typingInterval']) {
      clearInterval(component['typingInterval']);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isAboutInView).toBe(false);
      expect(component.currentText).toBe('');
      expect(component.textIndex).toBe(0);
      expect(component.charIndex).toBe(0);
      expect(component.isDeleting).toBe(false);
    });

    it('should have correct typing speeds', () => {
      expect(component.typeSpeed).toBe(100);
      expect(component.deleteSpeed).toBe(75);
      expect(component.pauseDuration).toBe(1000);
    });

    it('should have 7 text phrases', () => {
      expect(component.texts.length).toBe(7);
      expect(component.texts).toEqual([
        'I write code',
        'I build software',
        'I fix software',
        'I optimise systems',
        'I design system architecture',
        'I solve problems',
        'I secure systems'
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should add scroll event listener on init', () => {
      const addEventListenerSpy = spyOn(window, 'addEventListener');

      component.ngOnInit();

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', component.onScroll);
    });

    it('should start typing animation on init', fakeAsync(() => {
      component.ngOnInit();
      tick(100);

      expect(component.currentText.length).toBeGreaterThan(0);
    }));
  });

  describe('ngOnDestroy cleanup', () => {
    it('should remove scroll event listener on destroy', () => {
      const removeEventListenerSpy = spyOn(window, 'removeEventListener');

      component.ngOnInit();
      component.ngOnDestroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', component.onScroll);
    });

    it('should clear typing interval on destroy', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');

      component.ngOnInit();
      component.ngOnDestroy();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should not error when destroying without active interval', () => {
      component['typingInterval'] = undefined;

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Typewriter animation', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should type first character after typeSpeed delay', () => {
      component.ngOnInit();

      expect(component.currentText).toBe('');

      jasmine.clock().tick(100);
      expect(component.currentText).toBe('I');
    });

    it('should progressively type out the first text phrase', () => {
      component.ngOnInit();

      const firstText = component.texts[0]; // 'I write code'

      for (let i = 0; i <= firstText.length; i++) {
        expect(component.currentText).toBe(firstText.substring(0, i));
        jasmine.clock().tick(100);
      }
    });

    it('should pause after completing a phrase', () => {
      component.ngOnInit();

      const firstText = component.texts[0];

      // Type complete phrase
      for (let i = 0; i < firstText.length; i++) {
        jasmine.clock().tick(100);
      }

      expect(component.currentText).toBe(firstText);
      expect(component.isDeleting).toBe(false);

      // Pause duration should pass before deleting starts
      jasmine.clock().tick(999);
      expect(component.isDeleting).toBe(false);

      jasmine.clock().tick(1);
      jasmine.clock().tick(100); // interval continues at typeSpeed (100ms)
      expect(component.isDeleting).toBe(true);
    });


    it('should update charIndex correctly while typing', () => {
      component.ngOnInit();

      const firstText = component.texts[0];

      for (let i = 0; i < firstText.length; i++) {
        jasmine.clock().tick(100);
        expect(component.charIndex).toBe(i + 1);
      }
    });

    it('should switch to deleting mode when phrase is complete', () => {
      component.ngOnInit();

      const firstText = component.texts[0];

      // Type complete phrase
      for (let i = 0; i < firstText.length; i++) {
        jasmine.clock().tick(100);
      }

      expect(component.isDeleting).toBe(false);

      // Wait for pause
      jasmine.clock().tick(1000);
      jasmine.clock().tick(100); // interval continues at 100ms

      expect(component.isDeleting).toBe(true);
    });
  });

  describe('scrollToTechnologies()', () => {
    let mockTechnologiesSection: HTMLElement;
    let mockArrowButton: HTMLElement;

    beforeEach(() => {
      // Clean up any existing elements first
      const existingTechSection = document.getElementById('technologies');
      if (existingTechSection) {
        existingTechSection.remove();
      }
      const existingButtons = document.querySelectorAll('.arrow-button');
      existingButtons.forEach(btn => btn.remove());

      mockTechnologiesSection = document.createElement('div');
      mockTechnologiesSection.id = 'technologies';
      mockTechnologiesSection.scrollIntoView = jasmine.createSpy('scrollIntoView');
      document.body.appendChild(mockTechnologiesSection);

      mockArrowButton = document.createElement('button');
      mockArrowButton.className = 'arrow-button';
      document.body.appendChild(mockArrowButton);
    });

    afterEach(() => {
      if (mockTechnologiesSection && mockTechnologiesSection.parentNode) {
        mockTechnologiesSection.remove();
      }
      if (mockArrowButton && mockArrowButton.parentNode) {
        mockArrowButton.remove();
      }
      // Clean up any remaining elements
      const remainingTechSection = document.getElementById('technologies');
      if (remainingTechSection) {
        remainingTechSection.remove();
      }
      const remainingButtons = document.querySelectorAll('.arrow-button');
      remainingButtons.forEach(btn => btn.remove());
    });

    it('should scroll to technologies section with smooth behavior', () => {
      component.scrollToTechnologies();

      expect(mockTechnologiesSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should add hidden class to arrow button', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      component.scrollToTechnologies();

      expect(mockArrowButton.classList.contains('hidden')).toBe(true);
    });

    it('should not throw if technologies section does not exist', () => {
      mockTechnologiesSection.remove();

      expect(() => {
        component.scrollToTechnologies();
      }).not.toThrow();
    });

    it('should not throw if arrow button does not exist', () => {
      mockArrowButton.remove();

      expect(() => {
        component.scrollToTechnologies();
      }).not.toThrow();
    });

    it('should handle both section and button missing gracefully', () => {
      mockTechnologiesSection.remove();
      mockArrowButton.remove();

      expect(() => {
        component.scrollToTechnologies();
      }).not.toThrow();
    });
  });

  describe('Arrow button visibility based on scroll', () => {
    let mockArrowButton: HTMLElement;

    beforeEach(() => {
      // Clean up any existing arrow buttons first
      const existingButtons = document.querySelectorAll('.arrow-button');
      existingButtons.forEach(btn => btn.remove());

      mockArrowButton = document.createElement('button');
      mockArrowButton.className = 'arrow-button';
      document.body.appendChild(mockArrowButton);
    });

    afterEach(() => {
      if (mockArrowButton && mockArrowButton.parentNode) {
        mockArrowButton.remove();
      }
      // Clean up any remaining arrow buttons
      const remainingButtons = document.querySelectorAll('.arrow-button');
      remainingButtons.forEach(btn => btn.remove());
    });

    it('should add hidden class when scrollY > 0', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });

      component.onScroll();

      expect(mockArrowButton.classList.contains('hidden')).toBe(true);
    });

    it('should remove hidden class when scrollY is 0', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      // First, add the hidden class
      mockArrowButton.classList.add('hidden');

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0
      });

      component.onScroll();

      expect(mockArrowButton.classList.contains('hidden')).toBe(false);
    });

    it('should hide arrow button when scrolling down from top', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(false);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 50
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(true);
    });

    it('should show arrow button when scrolling back to top', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(true);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(false);
    });

    it('should not throw when arrow button does not exist', () => {
      mockArrowButton.remove();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });

      expect(() => {
        component.onScroll();
      }).not.toThrow();
    });

    it('should handle multiple scroll events correctly', () => {
      // Verify button exists in DOM
      const button = document.querySelector('.arrow-button');
      expect(button).toBeTruthy();

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(false);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(true);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 200
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(true);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0
      });
      component.onScroll();
      expect(mockArrowButton.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Window scroll event listener', () => {
    it('should respond to window scroll events', () => {
      const onScrollSpy = spyOn(component, 'onScroll');

      component.ngOnInit();
      window.dispatchEvent(new Event('scroll'));

      expect(onScrollSpy).toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    it('should display currentText in the template', () => {
      component.currentText = 'Test text';
      fixture.detectChanges();

      const typedText = compiled.querySelector('.typed-text');
      expect(typedText?.textContent).toBe('Test text');
    });

    it('should update displayed text when currentText changes', () => {
      component.currentText = 'First text';
      fixture.detectChanges();
      let typedText = compiled.querySelector('.typed-text');
      expect(typedText?.textContent).toBe('First text');

      component.currentText = 'Second text';
      fixture.detectChanges();
      typedText = compiled.querySelector('.typed-text');
      expect(typedText?.textContent).toBe('Second text');
    });

    it('should have cursor element in template', () => {
      fixture.detectChanges();
      const cursor = compiled.querySelector('.cursor');
      expect(cursor).toBeTruthy();
      expect(cursor?.textContent).toBe('|');
    });

    it('should call scrollToTechnologies when arrow button is clicked', () => {
      const scrollToTechnologiesSpy = spyOn(component, 'scrollToTechnologies');
      fixture.detectChanges();

      const arrowButton = compiled.querySelector('.arrow-button');
      if (arrowButton) {
        (arrowButton as HTMLElement).click();
        expect(scrollToTechnologiesSpy).toHaveBeenCalled();
      }
    });

    it('should display greeting text', () => {
      fixture.detectChanges();
      const greeting = compiled.querySelector('.greeting');
      expect(greeting?.textContent).toContain("Hi, I'm Juan");
    });

    it('should display name badge', () => {
      fixture.detectChanges();
      const nameBadge = compiled.querySelector('.name-badge');
      expect(nameBadge?.textContent).toBe('Juan Espares');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid initialization and destruction', () => {
      component.ngOnInit();
      component.ngOnDestroy();
      component.ngOnInit();
      component.ngOnDestroy();

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });

    it('should handle empty currentText', () => {
      component.currentText = '';
      fixture.detectChanges();

      const typedText = compiled.querySelector('.typed-text');
      expect(typedText?.textContent).toBe('');
    });

    it('should maintain typing state across component lifecycle', fakeAsync(() => {
      component.ngOnInit();

      tick(500);
      const textAfterDelay = component.currentText;

      expect(textAfterDelay.length).toBeGreaterThan(0);

      component.ngOnDestroy();
      const finalText = component.currentText;

      tick(500);
      // Text should not change after destruction
      expect(component.currentText).toBe(finalText);
    }));
  });

  describe('Performance and timing', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should use correct typeSpeed interval', () => {
      component.ngOnInit();

      const initialText = component.currentText;

      jasmine.clock().tick(99);
      expect(component.currentText).toBe(initialText);

      jasmine.clock().tick(1);
      expect(component.currentText.length).toBeGreaterThan(initialText.length);
    });

  });
});
