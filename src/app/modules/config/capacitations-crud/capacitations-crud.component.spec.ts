import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitationsCrudComponent } from './capacitations-crud.component';

describe('CapacitationsCrudComponent', () => {
  let component: CapacitationsCrudComponent;
  let fixture: ComponentFixture<CapacitationsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitationsCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitationsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
