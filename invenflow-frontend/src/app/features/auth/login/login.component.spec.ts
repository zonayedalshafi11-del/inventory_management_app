import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should create with invalid form by default', () => {
    const component = fixture.componentInstance;
    expect(component['form'].invalid).toBe(true);
  });

  it('should validate email and password', () => {
    const component = fixture.componentInstance;
    component['form'].patchValue({ email: 'admin@test.com', password: 'pass' });
    expect(component['form'].valid).toBe(true);
  });
});
