import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getS3KeyFromPathIfIsPage, pageExistsOnS3 } from './s3Controller';

describe('getS3KeyFromPathIfIsPage', () => {
  it('should return an S3 key ending in index.html, if the requested path is a page', () => {
    expect(getS3KeyFromPathIfIsPage('/internal/docs/latest/')).toBe(
      'internal/docs/latest/index.html'
    );
    expect(getS3KeyFromPathIfIsPage('/docs/release-notes/10.3')).toBe(
      'docs/release-notes/10.3/index.html'
    );
  });

  it('should return an S3 key if the path already ends in /html or .htm', () => {
    expect(getS3KeyFromPathIfIsPage('/cloud/pages/installation.html')).toBe(
      'cloud/pages/installation.html'
    );
    expect(getS3KeyFromPathIfIsPage('/old/frame.htm')).toBe('old/frame.htm');
  });

  it("should return undefined if it's a link to a file", () => {
    expect(getS3KeyFromPathIfIsPage('/help/busy.png')).toBe(undefined);
    expect(getS3KeyFromPathIfIsPage('/assets/bundle.js')).toBe(undefined);
    expect(getS3KeyFromPathIfIsPage('/old/manual.pdf')).toBe(undefined);
  });

  it('should handle paths with leading and trailing slashes', () => {
    expect(getS3KeyFromPathIfIsPage('//user/profile//')).toBe(
      'user/profile/index.html'
    );
    expect(getS3KeyFromPathIfIsPage('//help/busy.png')).toBe(undefined);
  });

  it('should handle paths with multiple periods', () => {
    expect(getS3KeyFromPathIfIsPage('/docs/release-notes/10.1.0')).toBe(
      'docs/release-notes/10.1.0/index.html'
    );
    expect(getS3KeyFromPathIfIsPage('/assets/bundle.243545.1344351.js')).toBe(
      undefined
    );
  });

  it('should replace every %20 with a space character', () => {
    expect(
      getS3KeyFromPathIfIsPage(
        '/docs/Getting%20started%20with%20gardening%20tools.html'
      )
    ).toBe('docs/Getting started with gardening tools.html');
    expect(
      getS3KeyFromPathIfIsPage(
        '/docs/Getting%20started%20with%20gardening%20tools'
      )
    ).toBe('docs/Getting started with gardening tools/index.html');
    expect(
      getS3KeyFromPathIfIsPage(
        '/docs/Getting%20started%20with%20gardening%20tools.png'
      )
    ).toBe(undefined);
  });
});

describe('pageExistsOnS3', () => {
  const mockS3Client = mockClient(S3Client);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if the page is available', async () => {
    mockS3Client.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });
    const result = await pageExistsOnS3('/some/existing/page');
    expect(result).toBe(true);
  });

  it('should return false if the page does not exist', async () => {
    mockS3Client.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 404,
      },
    });
    const result = await pageExistsOnS3('/some/missing/page');
    expect(result).toBe(false);
  });

  it('should return true for a file even if it does not exist', async () => {
    mockS3Client.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 404,
      },
    });
    const result = await pageExistsOnS3('/docs/assets/bundle.js');
    expect(result).toBe(true);
  });
});
