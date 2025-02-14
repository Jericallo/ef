import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEsignComponent } from './update-esign.component';

describe('UpdateEsignComponent', () => {
  let component: UpdateEsignComponent;
  let fixture: ComponentFixture<UpdateEsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
