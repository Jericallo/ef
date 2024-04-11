import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapacitationsComponent } from './add-capacitations.component';

describe('AddCapacitationsComponent', () => {
  let component: AddCapacitationsComponent;
  let fixture: ComponentFixture<AddCapacitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCapacitationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCapacitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
