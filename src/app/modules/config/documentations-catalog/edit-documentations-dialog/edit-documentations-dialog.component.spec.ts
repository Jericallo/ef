import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDocumentationsDialogComponent } from './edit-documentations-dialog.component';

describe('EditDocumentationsDialogComponent', () => {
  let component: EditDocumentationsDialogComponent;
  let fixture: ComponentFixture<EditDocumentationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDocumentationsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDocumentationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
