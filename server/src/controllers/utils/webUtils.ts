export function isKnownTypeOfResourceFile(path: string): boolean {
  const knownResourceExtensions = [
    '.css',
    '.js',
    '.jpg',
    '.jpeg',
    '.gif',
    '.png',
    '.svg',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.zip',
    '.rar',
    '.txt',
    '.xml',
    '.json',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.mp3',
    '.mp4',
    '.avi',
    '.mov',
    '.flv',
    '.swf',
    '.ts',
    '.webp',
    '.odt',
    '.ods',
    '.7z',
    '.yaml',
    '.otf',
    '.wav',
    '.mkv',
  ];

  const pathDotSegments = path.split('.');
  const pathExtension = `.${pathDotSegments[pathDotSegments.length - 1]}`;

  if (knownResourceExtensions.includes(pathExtension.toLowerCase())) {
    return true;
  }

  return false;
}
