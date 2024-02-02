import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCumplimientoComponent } from './detail-cumplimiento.component';

describe('DetailCumplimientoComponent', () => {
  let component: DetailCumplimientoComponent;
  let fixture: ComponentFixture<DetailCumplimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCumplimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCumplimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
