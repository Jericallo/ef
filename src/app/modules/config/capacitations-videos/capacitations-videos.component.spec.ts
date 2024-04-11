import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitationsVideosComponent } from './capacitations-videos.component';

describe('CapacitationsVideosComponent', () => {
  let component: CapacitationsVideosComponent;
  let fixture: ComponentFixture<CapacitationsVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitationsVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitationsVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
