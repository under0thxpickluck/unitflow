jest.mock('resend', () => ({ Resend: jest.fn() }))

import { buildContactEmailHtml } from '@/lib/resend'

describe('buildContactEmailHtml', () => {
  it('includes all contact fields in output', () => {
    const html = buildContactEmailHtml({
      name: 'John Smith',
      company: 'PC Shop Inc',
      country: 'USA',
      email: 'john@example.com',
      ebayUsername: 'johnsmith99',
      desiredParts: 'Core i5-3470 x50',
      quantity: '50',
      message: 'Need bulk CPUs monthly',
    })
    expect(html).toContain('John Smith')
    expect(html).toContain('PC Shop Inc')
    expect(html).toContain('USA')
    expect(html).toContain('john@example.com')
    expect(html).toContain('johnsmith99')
    expect(html).toContain('Core i5-3470 x50')
    expect(html).toContain('Need bulk CPUs monthly')
  })
})
