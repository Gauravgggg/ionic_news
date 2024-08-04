import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilephotoPage } from './profilephoto.page';

describe('ProfilephotoPage', () => {
  let component: ProfilephotoPage;
  let fixture: ComponentFixture<ProfilephotoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfilephotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
