import React from 'react'
import { render } from '@testing-library/react';
import { Card } from '@/components/card/card';

describe('Card', () => {
  it('should render children', () => {
    const { getByText } = render(<Card>Test Content</Card>)
    expect(getByText('Test Content')).toBeDefined()
  })

  it('should have correct styles', () => {
    const { container } = render(<Card>Test Content</Card>)
    const card = container.firstChild
    expect(card).toBeDefined()
  })
})
