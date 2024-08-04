import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewSettingSectionsPage } from './new-setting-sections.page';

describe('NewSettingSectionsPage', () => {
  let component: NewSettingSectionsPage;
  let fixture: ComponentFixture<NewSettingSectionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewSettingSectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
