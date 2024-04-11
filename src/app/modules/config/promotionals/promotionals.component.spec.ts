import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalsComponent } from './promotionals.component';

describe('PromotionalsComponent', () => {
  let component: PromotionalsComponent;
  let fixture: ComponentFixture<PromotionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
