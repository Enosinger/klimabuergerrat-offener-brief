import { EntryFieldTypes } from 'contentful';

export type SigneeEntrySkeleton = {
  contentTypeId: 'signee';
  fields: {
    name: EntryFieldTypes.Text;
    website: EntryFieldTypes.Text;
    logo: EntryFieldTypes.AssetLink;
    listOfSigningNames: EntryFieldTypes.Text;
  };
};
