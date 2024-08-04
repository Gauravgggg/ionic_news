import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QandAPage } from './qand-a.page';

describe('QandAPage', () => {
  let component: QandAPage;
  let fixture: ComponentFixture<QandAPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QandAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
