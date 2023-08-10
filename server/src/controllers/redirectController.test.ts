import { sortUrlsByVersion } from './redirectController';

describe('redirectController', () => {
  it('Higher semver is recognized as higher', () => {
    const lowUrl = ['my', 'doc', '2.0.3'];
    const highUrl = ['my', 'doc', '2.0.4'];
    expect(sortUrlsByVersion(highUrl, lowUrl, 2)).toEqual(1);
  });

  it('A URL with "latest" is considered higher', () => {
    const lowUrl = ['my', 'doc', '2.0.3'];
    const highUrl = ['my', 'doc', 'latest'];
    expect(sortUrlsByVersion(highUrl, lowUrl, 2)).toEqual(1);
  });

  it('A later ski release is considered a later release', () => {
    const lowUrl = ['my', 'doc', 'Banff'];
    const highUrl = ['my', 'doc', 'Hakuba'];
    expect(sortUrlsByVersion(highUrl, lowUrl, 2)).toEqual(1);
  });

  it('2020.11 is higher than 2020.05', () => {
    const lowUrl = ['my', 'doc', '2020.05'];
    const highUrl = ['my', 'doc', '2020.11'];
    expect(sortUrlsByVersion(highUrl, lowUrl, 2)).toEqual(1);
  });
});
