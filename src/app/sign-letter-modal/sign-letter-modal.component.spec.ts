import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SignLetterModalComponent } from './sign-letter-modal.component';
import { environment } from '../../environments/environment';

describe('SignLetterModalComponent', () => {
  let component: SignLetterModalComponent;
  let fixture: ComponentFixture<SignLetterModalComponent>;
  let httpMock: HttpTestingController;
  let modalServiceMock: { open: jest.Mock };
  const signeeUrl = `${environment.mailService.url}/signee`;

  beforeEach(async () => {
    modalServiceMock = { open: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [SignLetterModalComponent],
      imports: [FormsModule, FontAwesomeModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NgbModal, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignLetterModalComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('posts the form as FormData to the mail service signee endpoint', () => {
      component.form = { organisation: 'Test Org', email: 'test@example.com' };

      component.onSubmit();

      const req = httpMock.expectOne(signeeUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeInstanceOf(FormData);
      expect(req.request.body.get('organisation')).toBe('Test Org');
      expect(req.request.body.get('email')).toBe('test@example.com');

      req.flush({});
    });

    it('sets loading to true while the request is in flight', () => {
      component.form = { organisation: 'Test Org' };

      component.onSubmit();

      expect(component.loading).toBe(true);

      const req = httpMock.expectOne(signeeUrl);
      req.flush({});
    });

    it('on success sets formSubmitted, clears errorMessage and resets loading', () => {
      component.errorMessage = 'stale error';
      component.form = { organisation: 'Test Org' };

      component.onSubmit();

      const req = httpMock.expectOne(signeeUrl);
      req.flush({});

      expect(component.formSubmitted).toBe(true);
      expect(component.errorMessage).toBe('');
      expect(component.loading).toBe(false);
    });

    it('on error sets the German error message, leaves formSubmitted false and resets loading', () => {
      component.form = { organisation: 'Test Org' };

      component.onSubmit();

      const req = httpMock.expectOne(signeeUrl);
      req.flush('failure', { status: 500, statusText: 'Server Error' });

      expect(component.formSubmitted).toBe(false);
      expect(component.loading).toBe(false);
      expect(component.errorMessage).toBe(
        'Deine Zeichnung konnte nicht übermittelt werden. Versuche es später noch einmal oder wende direkt an kontakt@klima-rat.org. Vielen Dank für Dein Verständnis.'
      );
    });

    it('appends a previously selected logo file under the logo key', () => {
      const file = new File(['logo-bytes'], 'logo.png', { type: 'image/png' });
      component.form = { organisation: 'Test Org', logo: file };

      component.onSubmit();

      const req = httpMock.expectOne(signeeUrl);
      expect(req.request.body.get('logo')).toBe(file);

      req.flush({});
    });
  });

  describe('onFileSelect', () => {
    it('stores the first selected file under the logo key', () => {
      const file = new File(['data'], 'logo.png', { type: 'image/png' });
      const event = { target: { files: [file] } };

      component.onFileSelect(event);

      expect(component.form['logo']).toBe(file);
    });

    it('does nothing when the file list is empty', () => {
      const event = { target: { files: [] } };

      component.onFileSelect(event);

      expect(component.form['logo']).toBeUndefined();
    });
  });

  describe('open', () => {
    it('resets form, errorMessage, formSubmitted and loading when the modal closes', async () => {
      component.form = { organisation: 'stale' };
      component.errorMessage = 'stale error';
      component.formSubmitted = true;
      component.loading = true;

      const modalRef = { result: Promise.resolve('Mitzeichnen erfolgreich abgeschlossen') };
      modalServiceMock.open.mockReturnValue(modalRef);

      component.open({});
      await modalRef.result;

      expect(component.form).toEqual({});
      expect(component.errorMessage).toBe('');
      expect(component.formSubmitted).toBe(false);
      expect(component.loading).toBe(false);
    });
  });
});
