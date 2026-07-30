import { TestBed } from '@angular/core/testing';
import { createClient } from 'contentful';

import { ContentfulService } from './contentful.service';

jest.mock('contentful', () => ({
  createClient: jest.fn(),
}));

describe('ContentfulService', () => {
  let service: ContentfulService;
  let getEntryMock: jest.Mock;

  beforeEach(() => {
    getEntryMock = jest.fn();
    (createClient as jest.Mock).mockReturnValue({ getEntry: getEntryMock });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentfulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLetter fetches the letter entry by id', async () => {
    const entry = { fields: { text: 'Liebe Leserinnen und Leser' } };
    getEntryMock.mockResolvedValue(entry);

    const result = await service.getLetter();

    expect(getEntryMock).toHaveBeenCalledWith('2aDDbb4AjEQdCo0IW7AnLm');
    expect(result).toBe(entry);
  });

  it('getImpressum fetches the impressum entry by id', async () => {
    const entry = { fields: { text: 'Impressum' } };
    getEntryMock.mockResolvedValue(entry);

    const result = await service.getImpressum();

    expect(getEntryMock).toHaveBeenCalledWith('1RjJ8ucJJIekoeZ6Tz1ZLH');
    expect(result).toBe(entry);
  });

  it('getDataprivacy fetches the dataprivacy entry by id', async () => {
    const entry = { fields: { text: 'Datenschutz' } };
    getEntryMock.mockResolvedValue(entry);

    const result = await service.getDataprivacy();

    expect(getEntryMock).toHaveBeenCalledWith('4rC21AGeBowVcfQKLnwBPk');
    expect(result).toBe(entry);
  });

  it('getProgressbar fetches the progressbar entry by id', async () => {
    const entry = { fields: { phases: [], numberOfActivePhase: 1 } };
    getEntryMock.mockResolvedValue(entry);

    const result = await service.getProgressbar();

    expect(getEntryMock).toHaveBeenCalledWith('1YkTzVK4KBzfmsMyBqKSo8');
    expect(result).toBe(entry);
  });

  it('resolves with whatever the client returns for an entry with empty fields', async () => {
    const emptyEntry = { fields: {} };
    getEntryMock.mockResolvedValue(emptyEntry);

    const result = await service.getLetter();

    expect(result).toBe(emptyEntry);
  });

  it('propagates a rejected getEntry call, e.g. when the entry does not exist', async () => {
    getEntryMock.mockRejectedValue(new Error('The resource could not be found'));

    await expect(service.getImpressum()).rejects.toThrow(
      'The resource could not be found'
    );
  });
});
