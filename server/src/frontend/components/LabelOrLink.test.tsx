/** @jest-environment jsdom */
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabelOrLink, { LabelOrLinkProps } from './LabelOrLink';
import React from 'react';
import { DocUrlByIdResponse } from '../../controllers/configController';

const pageItemWithId: LabelOrLinkProps = {
  id: 'gwcpreleasenotes',
  label: 'Cloud Platform Release Notes',
};

const expectedUrl = 'cloud/gwcprelnotes/latest';
const mockResponse: DocUrlByIdResponse = {
  id: 'gwcpreleasenotes',
  url: expectedUrl,
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponse),
  })
) as jest.Mock;

test('checks behavior on id, link or url', async () => {
  await act(async () => {
    render(<LabelOrLink {...pageItemWithId} />);
  });
  await waitFor(() => {
    expect(screen.getByText(pageItemWithId.label)).toHaveAttribute(
      'href',
      expectedUrl
    );
  });
});

//TODO: test checking behavior when given different props: id, url or link.
//pass my own variable as an id/link/url and check response (as the most basic
//example on testing docs site)
//check response like this: expect(screen.getByRole('heading')).toHaveTextContent('hello there')
