import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCarouselComponent } from '../../app/image-carousel/image-carousel.component';

describe('ImageCarouselComponent', () => {
  let component: ImageCarouselComponent;
  let fixture: ComponentFixture<ImageCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCarouselComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 16 icon paths in ngOnInit (assets/icons/5.svg to assets/icons/20.svg)', () => {
    component.ngOnInit();

    expect(component.icons.length).toBe(16);
    expect(component.icons[0]).toBe('assets/icons/5.svg');
    expect(component.icons[15]).toBe('assets/icons/20.svg');
  });

  it('should have allIcons with 48 items (16 * 3 for seamless scroll)', () => {
    component.ngOnInit();

    expect(component.allIcons.length).toBe(48);
  });

  it('should replicate icons array three times in allIcons', () => {
    component.ngOnInit();

    // Verify the pattern repeats three times
    const firstSet = component.allIcons.slice(0, 16);
    const secondSet = component.allIcons.slice(16, 32);
    const thirdSet = component.allIcons.slice(32, 48);

    expect(firstSet).toEqual(component.icons);
    expect(secondSet).toEqual(component.icons);
    expect(thirdSet).toEqual(component.icons);
  });

  it('should have generateIconPaths method that works correctly', () => {
    const paths = component.generateIconPaths(5, 20);

    expect(paths.length).toBe(16);
    expect(paths[0]).toBe('assets/icons/5.svg');
    expect(paths[1]).toBe('assets/icons/6.svg');
    expect(paths[15]).toBe('assets/icons/20.svg');
  });

  it('should generate correct paths with generateIconPaths for any range', () => {
    const paths = component.generateIconPaths(1, 5);

    expect(paths.length).toBe(5);
    expect(paths).toEqual([
      'assets/icons/1.svg',
      'assets/icons/2.svg',
      'assets/icons/3.svg',
      'assets/icons/4.svg',
      'assets/icons/5.svg'
    ]);
  });
});
