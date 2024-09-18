import { isKnownTypeOfResourceFile } from './webUtils'; // Update this import path

describe('isKnownTypeOfResourceFile', () => {
  test('returns true for known file extensions', () => {
    const knownExtensions = [
      'style.css',
      'script.js',
      'image.jpg',
      'image.jpeg',
      'image.gif',
      'image.png',
      'image.svg',
      'document.pdf',
      'document.doc',
      'document.docx',
      'spreadsheet.xls',
      'spreadsheet.xlsx',
      'archive.zip',
      'archive.rar',
      'file.txt',
      'data.xml',
      'data.json',
      'favicon.ico',
      'font.woff',
      'font.woff2',
      'font.ttf',
      'font.eot',
      'audio.mp3',
      'video.mp4',
      'video.avi',
      'video.mov',
      'video.flv',
      'animation.swf',
    ];

    knownExtensions.forEach((file) => {
      expect(isKnownTypeOfResourceFile(file)).toBe(true);
    });
  });

  test('returns false for unknown file extensions', () => {
    const unknownExtensions = [
      'video.r4a',
      'file.unknown',
    ];

    unknownExtensions.forEach((file) => {
      expect(isKnownTypeOfResourceFile(file)).toBe(false);
    });
  });

  test('handles files without extensions', () => {
    expect(isKnownTypeOfResourceFile('filename')).toBe(false);
  });

  test('handles files with multiple dots', () => {
    expect(isKnownTypeOfResourceFile('archive.tar.gz')).toBe(false);
    expect(isKnownTypeOfResourceFile('script.min.js')).toBe(true);
  });

  test('is not case-sensitive', () => {
    expect(isKnownTypeOfResourceFile('image.JPG')).toBe(true);
    expect(isKnownTypeOfResourceFile('script.JS')).toBe(true);
  });

  test('handles paths with directories', () => {
    expect(isKnownTypeOfResourceFile('/path/to/file.jpg')).toBe(true);
    expect(isKnownTypeOfResourceFile('C:\\Users\\Name\\file.doc')).toBe(true);
  });
});
