import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePromotionalComponent } from './delete-promotional.component';

describe('DeletePromotionalComponent', () => {
  let component: DeletePromotionalComponent;
  let fixture: ComponentFixture<DeletePromotionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePromotionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePromotionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
