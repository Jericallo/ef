import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyQuestionarComponent } from './monthly-questionar.component';

describe('MonthlyQuestionarComponent', () => {
  let component: MonthlyQuestionarComponent;
  let fixture: ComponentFixture<MonthlyQuestionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyQuestionarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyQuestionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
