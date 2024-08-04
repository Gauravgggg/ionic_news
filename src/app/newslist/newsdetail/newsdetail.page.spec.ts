import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsdetailPage } from './newsdetail.page';

describe('NewsdetailPage', () => {
  let component: NewsdetailPage;
  let fixture: ComponentFixture<NewsdetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewsdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
