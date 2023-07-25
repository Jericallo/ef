import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyesConfigComponent } from './leyes-config.component';

describe('LeyesConfigComponent', () => {
  let component: LeyesConfigComponent;
  let fixture: ComponentFixture<LeyesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeyesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeyesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
