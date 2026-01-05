import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render template with about-container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const aboutContainer = compiled.querySelector('.about-container');

    expect(aboutContainer).toBeTruthy();
  });

  it('should render profile image', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const profileImage = compiled.querySelector('img.profile-pic');

    expect(profileImage).toBeTruthy();
    expect(profileImage?.getAttribute('src')).toBe('assets/juan-face.png');
    expect(profileImage?.getAttribute('alt')).toBe("Juan's face");
  });

  it('should render "About myself" heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h2');

    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('About myself');
  });

  it('should render content paragraphs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraphs = compiled.querySelectorAll('p');

    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(paragraphs[0].textContent).toContain("Hi, I'm Juan");
  });
});
