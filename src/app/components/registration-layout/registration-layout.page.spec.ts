import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  RegistrationLayoutPage } from './registration-layout.page';

describe('RegistrationLayoutPage', () => {
  let component: RegistrationLayoutPage;
  let fixture: ComponentFixture<RegistrationLayoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationLayoutPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
