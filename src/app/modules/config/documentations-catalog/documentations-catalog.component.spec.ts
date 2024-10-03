import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationsCatalogComponent } from './documentations-catalog.component';

describe('DocumentationsCatalogComponent', () => {
  let component: DocumentationsCatalogComponent;
  let fixture: ComponentFixture<DocumentationsCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentationsCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentationsCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
