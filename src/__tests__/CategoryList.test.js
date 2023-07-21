import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryList from './CategoryList';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { _id: '1', name: 'Category 1' },
        { _id: '2', name: 'Category 2' },
      ]),
  })
);

describe('CategoryList', () => {
  it('should fetch and render a list of categories', async () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    const loadingMessage = screen.getByText('Categories');
    expect(loadingMessage).toBeInTheDocument();

    await waitFor(() => {
      const categoryLinks = screen.getAllByRole('link');
      expect(categoryLinks).toHaveLength(2);

      expect(categoryLinks[0]).toHaveTextContent('Category 1');
      expect(categoryLinks[1]).toHaveTextContent('Category 2');
    });
  });

  it('should display "No categories found." message when no categories are fetched', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    const noCategoriesMessage = await screen.findByText('No categories found.');
    expect(noCategoriesMessage).toBeInTheDocument();
  });

  it('should handle error when fetching categories', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch categories')));

    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText('Error fetching categories:');
    expect(errorMessage).toBeInTheDocument();
  });
});
