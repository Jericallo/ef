import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompaniesDialogComponent } from './edit-companies-dialog.component';

describe('EditCompaniesDialogComponent', () => {
  let component: EditCompaniesDialogComponent;
  let fixture: ComponentFixture<EditCompaniesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompaniesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompaniesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
