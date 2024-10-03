import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentationsDialogComponent } from './add-documentations-dialog.component';

describe('AddDocumentationsDialogComponent', () => {
  let component: AddDocumentationsDialogComponent;
  let fixture: ComponentFixture<AddDocumentationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDocumentationsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDocumentationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
