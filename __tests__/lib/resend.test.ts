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
      quantity: '50 units',
      message: 'Need bulk CPUs monthly',
    })
    expect(html).toContain('John Smith')
    expect(html).toContain('PC Shop Inc')
    expect(html).toContain('USA')
    expect(html).toContain('john@example.com')
    expect(html).toContain('johnsmith99')
    expect(html).toContain('Core i5-3470 x50')
    expect(html).toContain('50 units')
    expect(html).toContain('Need bulk CPUs monthly')
  })
})

describe('buildContactEmailHtml escaping', () => {
  it('入力の HTML をそのまま埋め込まない', () => {
    const html = buildContactEmailHtml({
      name: '<img src=x onerror=alert(1)>',
      company: '',
      country: 'US',
      email: 'a@b.co',
      ebayUsername: '',
      desiredParts: '<a href="http://evil">click</a>',
      quantity: '1',
      message: 'hi & bye',
    })
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<a href')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).toContain('hi &amp; bye')
  })
})
