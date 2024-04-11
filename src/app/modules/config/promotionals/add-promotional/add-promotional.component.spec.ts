import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionalComponent } from './add-promotional.component';

describe('AddPromotionalComponent', () => {
  let component: AddPromotionalComponent;
  let fixture: ComponentFixture<AddPromotionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPromotionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPromotionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
