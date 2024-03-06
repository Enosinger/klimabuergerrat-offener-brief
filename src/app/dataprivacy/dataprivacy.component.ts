import { Component, Input, OnInit } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Contact } from '../contact.interface';
import { ContentfulService } from '../contentful.service';

@Component({
  selector: 'app-dataprivacy',
  templateUrl: './dataprivacy.component.html',
  styleUrls: ['./dataprivacy.component.css'],
})
export class DataprivacyComponent implements OnInit {
  responsible: Contact;
  text: {};
  introductoryParagraph: string;
  title: string;

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit(): void {
    this.contentfulService.getDataprivacy().then((dataprivacy) => {
      if (dataprivacy.fields.verantwortlich) { this.responsible = dataprivacy.fields.verantwortlich; }
      if (dataprivacy.fields.titel) { this.title = dataprivacy.fields.titel; }
      if (dataprivacy.fields.text) { this.text = dataprivacy.fields.text; }
      if (dataprivacy.fields.einleitendeFormulierung) { this.introductoryParagraph = dataprivacy.fields.einleitendeFormulierung; }
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
