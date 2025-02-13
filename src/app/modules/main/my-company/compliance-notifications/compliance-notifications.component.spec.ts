import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceNotificationsComponent } from './compliance-notifications.component';

describe('ComplianceNotificationsComponent', () => {
  let component: ComplianceNotificationsComponent;
  let fixture: ComponentFixture<ComplianceNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
