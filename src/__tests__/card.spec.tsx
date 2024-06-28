import React from 'react'
import { render } from '@testing-library/react'
import { Card } from '../components/card/card'

describe('Card', () => {
  it('should render children', () => {
    const { getByText } = render(<Card>Test Content</Card>)
    expect(getByText('Test Content')).toBeDefined()
  })

  it('should have correct styles', () => {
    const { container } = render(<Card>Test Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('shadow-lg m-4 p-2 rounded-xl grid grid-cols-12 col-span-12 col-start-1 bg-purple-900 justify-start items-stretch flex-wrap flex-row')
    expect(card).toHaveStyle('minHeight: 180px')
  })
})
