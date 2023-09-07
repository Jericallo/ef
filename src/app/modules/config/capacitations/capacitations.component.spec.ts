import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitationsComponent } from './capacitations.component';

describe('CapacitationsComponent', () => {
  let component: CapacitationsComponent;
  let fixture: ComponentFixture<CapacitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
