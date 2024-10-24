import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPointComponent } from './add-point.component';

describe('AddPointComponent', () => {
  let component: AddPointComponent;
  let fixture: ComponentFixture<AddPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
