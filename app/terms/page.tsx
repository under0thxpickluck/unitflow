import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for UNITFLOW JAPAN.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-xs mb-10">Last updated: May 2026</p>
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        {[
          { title: 'Purchases', content: "All purchases are made through eBay. By purchasing, you agree to eBay's User Agreement and Buyer policies. UNITFLOW JAPAN operates as an eBay seller and is bound by eBay's seller policies." },
          { title: 'Item Condition', content: 'All items are used and sold as-described. Condition grades (Tested, Untested, For Parts, As-is) are defined on our Quality Policy page. We make no warranties beyond what is stated in the eBay listing.' },
          { title: 'Returns', content: "Return policies are governed by our eBay store policies as listed on eBay. Item not as described claims must be made through eBay's resolution center." },
          { title: 'Limitation of Liability', content: 'UNITFLOW JAPAN is not liable for damages arising from the use or inability to use purchased components. Maximum liability is limited to the purchase price of the item.' },
          { title: 'Contact Inquiries', content: 'Information submitted via our contact form is for inquiry purposes only and does not constitute a purchase agreement or binding commitment.' },
        ].map((s) => (
          <div key={s.title}>
            <h2 className="text-white font-medium mb-2">{s.title}</h2>
            <p>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
