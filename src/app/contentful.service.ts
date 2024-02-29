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
      .getEntry('2aDDbb4AjEQdCo0IW7AnLm')
      .then((res) => res);
  }

  getImpressum(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntry('1RjJ8ucJJIekoeZ6Tz1ZLH')
      .then((res) => res);
  }

  getDataprivacy(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntry('4rC21AGeBowVcfQKLnwBPk')
      .then((res) => res);
  }

  getProgressbar(): Promise<Entry<any>> {
    return this.contentfulClient
      .getEntry('1YkTzVK4KBzfmsMyBqKSo8')
      .then((res) => res);
  }
}
