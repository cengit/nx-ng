import { async, TestBed } from '@angular/core/testing';
import { MyappViewsMyappModule } from './myapp-views-myapp.module';

describe('MyappViewsMyappModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MyappViewsMyappModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MyappViewsMyappModule).toBeDefined();
  });
});
