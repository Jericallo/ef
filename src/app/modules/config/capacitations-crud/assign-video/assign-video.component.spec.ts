import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVideoComponent } from './assign-video.component';

describe('AssignVideoComponent', () => {
  let component: AssignVideoComponent;
  let fixture: ComponentFixture<AssignVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
