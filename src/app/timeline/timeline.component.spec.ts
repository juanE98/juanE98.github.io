import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 7 events', () => {
    expect(component.events.length).toBe(7);
  });

  it('should reverse events array in constructor', () => {
    // Create a new instance to test constructor behavior
    const testComponent = new TimelineComponent();

    // The original order has "Pharmacy Student" first and "Contal Services" last
    // After reverse, "Contal Services" should be first
    expect(testComponent.events[0][0]).toBe('Contal Services');
  });

  it('should have "Contal Services" as first event after reverse', () => {
    expect(component.events[0][0]).toBe('Contal Services');
    expect(component.events[0][1]).toBe('Backend Software Engineer - Current');
    expect(component.events[0][2]).toBe('Java backend with Spring Boot');
  });

  it('should have each event as a 3-element string array [title, subtitle, description]', () => {
    component.events.forEach((event) => {
      expect(Array.isArray(event)).toBeTruthy();
      expect(event.length).toBe(3);
      expect(typeof event[0]).toBe('string'); // title
      expect(typeof event[1]).toBe('string'); // subtitle
      expect(typeof event[2]).toBe('string'); // description
    });
  });

  it('should have "Pharmacy Student" as last event after reverse', () => {
    const lastEvent = component.events[component.events.length - 1];

    expect(lastEvent[0]).toBe('Pharmacy Student');
    expect(lastEvent[1]).toBe('Calanna Terrywhite | 2018');
    expect(lastEvent[2]).toBe('rural pharmacy student placement');
  });

  it('should contain all expected events', () => {
    const eventTitles = component.events.map(event => event[0]);

    expect(eventTitles).toContain('Contal Services');
    expect(eventTitles).toContain('Dye and Durham');
    expect(eventTitles).toContain('Scriptsoft');
    expect(eventTitles).toContain('Bachelor of Computer Science');
    expect(eventTitles).toContain('Pharmacy Assistant');
    expect(eventTitles).toContain('Bachelor of Pharmaceutics and Therapeutic Science');
    expect(eventTitles).toContain('Pharmacy Student');
  });
});
