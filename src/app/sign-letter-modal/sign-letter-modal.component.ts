import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-letter-modal',
  templateUrl: './sign-letter-modal.component.html',
  styleUrls: ['./sign-letter-modal.component.css'],
})
export class SignLetterModalComponent implements OnInit {
  closeResult: string;
  faEnvelope = faEnvelope;

  form = {};
  loading = false;
  errorMessage = '';

  formSubmitted = false;

  constructor(private modalService: NgbModal, private http: HttpClient) { }

  ngOnInit(): void { }

  open(content): void {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.formSubmitted = false;
          this.form = {};
          this.errorMessage = '';
          this.loading = false;
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  onSubmit(): void {
    this.loading = true;
    const formData = new FormData();
    for (const key in this.form) {
      if (key === 'logo') {
        formData.append('logo', this.form[key]);
      } else {
        formData.append(key, this.form[key]);
      }
    }
    this.http
      .post<any>(environment.mailService.url + '/signee', formData)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.formSubmitted = true;
          this.errorMessage = '';
        },
        error: (error) => {
          this.formSubmitted = false;
          this.loading = false;
          console.error(error);
          this.errorMessage =
            'Deine Zeichnung konnte nicht übermittelt werden. Versuche es später noch einmal oder wende direkt an kontakt@klima-rat.org. Vielen Dank für Dein Verständnis.';
        },
      });
  }

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const key = 'logo';
      this.form[key] = file;
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
