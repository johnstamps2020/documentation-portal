/** @jest-environment jsdom */
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabelOrLink, { LabelOrLinkProps } from './LabelOrLink';
import React from 'react';
import { DocUrlByIdResponse } from '../../controllers/configController';

describe('test loading based on id, page and link', () => {
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

  test('response from id', async () => {
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

  const pageItemWithPage: LabelOrLinkProps = {
    page: 'cloudProducts/elysian/bcGwCloud/2022.05',
    label: 'BillingCenter',
  };
  const expectedPage = 'cloudProducts/elysian/bcGwCloud/2022.05';

  test('response from page', async () => {
    await act(async () => {
      render(<LabelOrLink {...pageItemWithPage} />);
    });
    await waitFor(() => {
      expect(screen.getByText(pageItemWithPage.label)).toHaveAttribute(
        'href',
        expectedPage
      );
    });
  });

  const pageItemWithLink: LabelOrLinkProps = {
    link: 'https://docs.guidewire.com/cloudProducts/elysian',
    label: 'Guidewire Documentation',
  };
  const expectedLink = 'https://docs.guidewire.com/cloudProducts/elysian';

  test('response from link', async () => {
    await act(async () => {
      render(<LabelOrLink {...pageItemWithLink} />);
    });
    await waitFor(() => {
      expect(screen.getByText(pageItemWithLink.label)).toHaveAttribute(
        'href',
        expectedLink
      );
    });
  });
});
