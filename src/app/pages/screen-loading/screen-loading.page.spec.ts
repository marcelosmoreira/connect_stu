import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenLoadingPage } from './screen-loading.page';

describe('ScreenLoadingPage', () => {
  let component: ScreenLoadingPage;
  let fixture: ComponentFixture<ScreenLoadingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenLoadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
