import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceKeysHistoryComponent } from './compliance-keys-history.component';

describe('ComplianceKeysHistoryComponent', () => {
  let component: ComplianceKeysHistoryComponent;
  let fixture: ComponentFixture<ComplianceKeysHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceKeysHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceKeysHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
