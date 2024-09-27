import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { VersionSelector } from './VersionSelector';
import { VersionSelectorItem } from '../types';

describe('VersionSelector', () => {
  const mockAvailableVersions: VersionSelectorItem[] = [
    {
      label: 'Version 1.0',
      url: 'v1',
      versions: ['1.0.x'],
      releases: ['Stable'],
      currentlySelected: true,
    },
    {
      label: 'Version 2.0',
      url: 'v2',
      versions: ['2.0.x'],
      releases: ['Beta'],
      currentlySelected: false,
    },
    {
      label: 'Main',
      releases: [],
      versions: [],
      url: 'main',
      currentlySelected: false,
    },
  ];

  // Mock window.location
  const mockAssign = vi.fn();
  const originalLocation = window.location;

  beforeAll(() => {
    // Define a custom location object
    const customLocation = {
      ...originalLocation,
      assign: mockAssign,
      pathname: '/v1/docs/intro',
    };

    // Use Object.defineProperty to mock window.location
    Object.defineProperty(window, 'location', {
      value: customLocation,
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original location object
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  beforeEach(() => {
    mockAssign.mockClear();
  });

  test('renders with correct initial selected value', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('Stable (1.0.x)');
  });

  test('displays all version options correctly', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));

    const dropdown = screen.getByRole('listbox');

    expect(within(dropdown).getByText('Stable (1.0.x)')).toBeInTheDocument();
    expect(within(dropdown).getByText('Beta (2.0.x)')).toBeInTheDocument();
    expect(within(dropdown).getByText('Main')).toBeInTheDocument();
  });

  test('handles version change correctly', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Beta (2.0.x)'));

    expect(mockAssign).toHaveBeenCalledWith('/v2/docs/intro');
  });

  test('redirects correctly', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Beta (2.0.x)'));

    expect(mockAssign).toHaveBeenCalledWith('/v2/docs/intro');
  });

  test('getLabelFromVersionSelectorItem returns correct label with releases', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));

    const dropdown = screen.getByRole('listbox');
    const menuItem = within(dropdown).getByText('Stable (1.0.x)');

    expect(menuItem).toBeInTheDocument();
  });

  test('getLabelFromVersionSelectorItem returns correct label without releases', () => {
    render(<VersionSelector availableVersions={mockAvailableVersions} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const menuItem = screen.getByText('Main');

    expect(menuItem).toBeInTheDocument();
  });
});
