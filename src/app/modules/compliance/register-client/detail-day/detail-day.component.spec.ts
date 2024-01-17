import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDayComponent } from './detail-day.component';

describe('DetailDayComponent', () => {
  let component: DetailDayComponent;
  let fixture: ComponentFixture<DetailDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
