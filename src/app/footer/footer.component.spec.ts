import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have LinkedIn link with correct href, target="_blank", and rel="noopener noreferrer"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkedInLink = compiled.querySelector('a[href="https://www.linkedin.com/in/juan-espares/"]');

    expect(linkedInLink).toBeTruthy();
    expect(linkedInLink?.getAttribute('target')).toBe('_blank');
    expect(linkedInLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should have GitHub link with correct href, target="_blank", and rel="noopener noreferrer"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubLink = compiled.querySelector('a[href="https://github.com/juanE98"]');

    expect(githubLink).toBeTruthy();
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const copyrightDiv = compiled.querySelector('.copyright');

    expect(copyrightDiv).toBeTruthy();
    expect(copyrightDiv?.textContent).toContain('2024 Juan Espares. All rights reserved.');
  });
});
