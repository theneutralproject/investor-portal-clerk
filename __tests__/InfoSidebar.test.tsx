/**
 * @jest-environment jsdom
 */
import InfoSidebar from '@/components/InfoSidebar';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('InfoSidebar', () => {
  it('renders both expected headings', () => {
    render(<InfoSidebar />);

    const questionHeading = screen.getByRole('heading', {
      level: 5,
      name: 'Have questions?',
    });
    const aboutHeading = screen.getByRole('heading', {
      level: 5,
      name: 'About The Neutral Project',
    });

    expect(questionHeading).toBeInTheDocument();
    expect(aboutHeading).toBeInTheDocument();
  });
});
