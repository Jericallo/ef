import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceOpinionHistoryComponent } from './compliance-opinion-history.component';

describe('ComplianceOpinionHistoryComponent', () => {
  let component: ComplianceOpinionHistoryComponent;
  let fixture: ComponentFixture<ComplianceOpinionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceOpinionHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceOpinionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
