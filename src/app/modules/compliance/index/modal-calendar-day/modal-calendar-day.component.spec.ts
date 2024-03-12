import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalendarDayComponent } from './modal-calendar-day.component';

describe('ModalCalendarDayComponent', () => {
  let component: ModalCalendarDayComponent;
  let fixture: ComponentFixture<ModalCalendarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCalendarDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCalendarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
