import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentAndParagraphComponent } from './search-document-and-paragraph.component';

describe('SearchDocumentAndParagraphComponent', () => {
  let component: SearchDocumentAndParagraphComponent;
  let fixture: ComponentFixture<SearchDocumentAndParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDocumentAndParagraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDocumentAndParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
