import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css'],
})
export class ContactModalComponent implements OnInit {
  closeResult: string;

  form = {};
  loading: Boolean = false;
  errorMessage = '';

  formSubmitted: Boolean = false;
  faEnvelope = faEnvelope;
  constructor(private modalService: NgbModal, private http: HttpClient) {}

  ngOnInit(): void {}

  open(content) {
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
  onSubmit() {
    this.loading = true;

    this.http
      .post<any>(environment.mailService.url + '/contact', this.form)
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
            'Deine Nachricht konnte nicht übermittelt werden. Bitte versuche es später noch einmal oder wende dich direkt an kontakt@klima-rat.org. Vielen Dank für dein Verständnis.';
        },
      });
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
