import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionarieComponent } from './questionarie.component';

describe('QuestionarieComponent', () => {
  let component: QuestionarieComponent;
  let fixture: ComponentFixture<QuestionarieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionarieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionarieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
