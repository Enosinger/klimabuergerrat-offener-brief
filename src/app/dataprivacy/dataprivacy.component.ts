import { Component, Input, OnInit } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Contact } from '../contact.interface';
import { ContentfulService } from '../contentful.service';

@Component({
    selector: 'app-dataprivacy',
    templateUrl: './dataprivacy.component.html',
    styleUrls: ['./dataprivacy.component.css'],
    standalone: false
})
export class DataprivacyComponent implements OnInit {
  responsible: Contact | any;
  text: {};
  introductoryParagraph: string | any;
  title: string | any;
  contactMail:
    | {
        fields: {
          text: string;
          mailadress: string;
        };
      }
    | any;

  constructor(private contentfulService: ContentfulService) {}

  ngOnInit(): void {
    this.contentfulService.getDataprivacy().then((dataprivacy) => {
      if (dataprivacy.fields.verantwortlich) {
        this.responsible = dataprivacy.fields.verantwortlich;
      }
      if (dataprivacy.fields.titel) {
        this.title = dataprivacy.fields.titel;
      }
      if (dataprivacy.fields.text) {
        this.text = dataprivacy.fields.text;
      }
      if (dataprivacy.fields.einleitendeFormulierung) {
        this.introductoryParagraph = dataprivacy.fields.einleitendeFormulierung;
      }
      if (dataprivacy.fields.contactMail) {
        this.contactMail = dataprivacy.fields.contactMail;
      }
    });
  }

  // https://stackoverflow.com/questions/57893367/display-contentful-richtext-in-angular'
  _returnHtmlFromRichText(richText): string {
    if (
      richText === undefined ||
      richText === null ||
      richText.nodeType !== 'document'
    ) {
      return '<p>Loading ...</p>';
    }
    return documentToHtmlString(richText);
  }
}
