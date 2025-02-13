import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceTaxReturnComponent } from './compliance-tax-return.component';

describe('ComplianceTaxReturnComponent', () => {
  let component: ComplianceTaxReturnComponent;
  let fixture: ComponentFixture<ComplianceTaxReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceTaxReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceTaxReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
