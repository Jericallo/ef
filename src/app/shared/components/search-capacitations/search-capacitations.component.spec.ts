import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCapacitationsComponent } from './search-capacitations.component';

describe('SearchCapacitationsComponent', () => {
  let component: SearchCapacitationsComponent;
  let fixture: ComponentFixture<SearchCapacitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCapacitationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCapacitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
