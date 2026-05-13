import { render, screen } from '@testing-library/react'
import StatusBadge from '@/components/StatusBadge'

describe('StatusBadge', () => {
  it('renders Tested badge with green color', () => {
    render(<StatusBadge condition="Tested" />)
    const badge = screen.getByText('Tested')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-green-400')
  })

  it('renders Untested badge', () => {
    render(<StatusBadge condition="Untested" />)
    expect(screen.getByText('Untested')).toBeInTheDocument()
  })

  it('renders For Parts badge with orange color', () => {
    render(<StatusBadge condition="For Parts" />)
    const badge = screen.getByText('For Parts')
    expect(badge).toHaveClass('text-orange-400')
  })
})
