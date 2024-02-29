import { Component, Input, OnInit } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Contact } from '../contact.interface';
import { ContentfulService } from '../contentful.service';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.css'],
})
export class ImpressumComponent implements OnInit {
  technicalContacts;
  responsible;
  text;
  constructor(private contentfulService: ContentfulService) {
    this.contentfulService.getImpressum().then((impressum) => {
      impressum.fields.verantwortlich
        ? (this.responsible = impressum.fields.verantwortlich)
        : console.log(new Error('No responsbile'));
      impressum.fields.technischUmsetzende
        ? (this.technicalContacts = impressum.fields.technischUmsetzende)
        : console.log(new Error('No technical contacts'));
      impressum.fields.text
        ? (this.text = impressum.fields.text)
        : console.log(new Error('No text'));
    });
  }

  ngOnInit(): void { }

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
