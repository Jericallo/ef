import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFractionComponent } from './add-fraction.component';

describe('AddFractionComponent', () => {
  let component: AddFractionComponent;
  let fixture: ComponentFixture<AddFractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFractionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
