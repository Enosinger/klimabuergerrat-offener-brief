import { Component, Input, OnInit } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { ContentfulService } from '../contentful.service';

@Component({
    selector: 'app-letter',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.css'],
    standalone: false
})
export class LetterComponent implements OnInit {
  contactNotice;
  text;
  addressant;
  title;
  signees;

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit(): void {
    this.contentfulService.getLetter().then((letter) => {
      if (letter.fields.text) { this.text = letter.fields.text; }
      if (letter.fields.richTextTitle) { this.title = letter.fields.richTextTitle; }
      if (letter.fields.addressat) { this.addressant = letter.fields.addressat; }
      if (letter.fields.kontakthinweis) { this.contactNotice = letter.fields.kontakthinweis; }
      if (letter.fields.signees) { this.signees = letter.fields.signees; }
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
