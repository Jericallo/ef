import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapacitationsVideosComponent } from './add-capacitations-videos.component';

describe('AddCapacitationsVideosComponent', () => {
  let component: AddCapacitationsVideosComponent;
  let fixture: ComponentFixture<AddCapacitationsVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCapacitationsVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCapacitationsVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
