import { Injectable } from '@angular/core';
import { createClient, Entry } from 'contentful';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private contentfulClient = createClient({
    space: environment.contentful.space,
    environment: environment.contentful.environment,
    accessToken: environment.contentful.accessToken,
  });

  constructor() {}

  getLetter(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntries({ 'sys.id': '4Ow54aYCm1pBL07FDAj82t', include: 1 })
      .then((res) => res.items[0]);
  }

  getImpressum(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntries({ 'sys.id': '54eHPXDvH76RUtN9bodIJZ', include: 1 })
      .then((res) => res.items[0]);
  }

  getDataprivacy(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntries({ 'sys.id': '1jkTCBoA2QirKeEN4dgtnj', include: 1 })
      .then((res) => res.items[0]);
  }

  getProgressbar(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntries({ 'sys.id': '576DSiP37ftSEVUxZoU9yR' })
      .then((res) => res.items[0]);
  }
}
