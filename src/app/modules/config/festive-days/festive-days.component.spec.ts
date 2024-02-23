import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestiveDaysComponent } from './festive-days.component';

describe('FestiveDaysComponent', () => {
  let component: FestiveDaysComponent;
  let fixture: ComponentFixture<FestiveDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FestiveDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FestiveDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
