import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentationComponent } from './search-documentation.component';

describe('SearchDocumentationComponent', () => {
  let component: SearchDocumentationComponent;
  let fixture: ComponentFixture<SearchDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDocumentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
