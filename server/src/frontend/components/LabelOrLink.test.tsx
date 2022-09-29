/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LabelOrLink from './LabelOrLink';
import { PageItem } from '../../model/entity/PageItem';
import { Environment } from '../../types/environment';
import React from 'react';

let pageItemId = new PageItem();
pageItemId.id = 'gwcpreleasenotes';
pageItemId.label = 'Cloud Platform Release Notes';
pageItemId.link = '';
pageItemId.page = '';

test('checks behavior on id, link or url', () => {
  render(
    <LabelOrLink
      id={pageItemId.id}
      label={pageItemId.label}
      link={pageItemId.link}
      page={pageItemId.page}
      itemId={0}
      class={''}
      items={[]}
      env={Environment.DEV}
    />
  );
  screen.debug();
});

//TODO: test checking behavior when given different props: id, url or link.
//pass my own variable as an id/link/url and check response (as the most basic
//example on testing docs site)
//check response like this: expect(screen.getByRole('heading')).toHaveTextContent('hello there')
