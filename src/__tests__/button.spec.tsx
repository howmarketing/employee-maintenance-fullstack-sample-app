import { render, screen } from '@testing-library/react';
import { Button } from '@/components/button/button'

it("should render button component", () => {
    render(<Button>Button</Button>);
    const element = screen.getByText('Button');
    expect(element).toBeDefined()
})
