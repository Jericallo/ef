import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCapacitationsVideosComponent } from './delete-capacitations-videos.component';

describe('DeleteCapacitationsVideosComponent', () => {
  let component: DeleteCapacitationsVideosComponent;
  let fixture: ComponentFixture<DeleteCapacitationsVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCapacitationsVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCapacitationsVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
