import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIntrosComponent } from './edit-intros.component';

describe('EditIntrosComponent', () => {
  let component: EditIntrosComponent;
  let fixture: ComponentFixture<EditIntrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIntrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIntrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
