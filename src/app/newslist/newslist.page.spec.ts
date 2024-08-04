import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewslistPage } from './newslist.page';

describe('NewslistPage', () => {
  let component: NewslistPage;
  let fixture: ComponentFixture<NewslistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
