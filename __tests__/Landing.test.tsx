import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Landing Page', () => {
  it('renders the hero headline correctly', () => {
    render(<Home />);
    
    const headline = screen.getByText(/Stop overpaying for AI compute/i);
    expect(headline).toBeInTheDocument();
  });

  it('contains the Run Audit CTA button', () => {
    render(<Home />);
    
    // There are two buttons (header and hero)
    const ctaButtons = screen.getAllByText(/Run Audit|Run Free Infrastructure Audit/i);
    expect(ctaButtons.length).toBeGreaterThan(0);
  });
});
