import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'FAQ — UNITFLOW JAPAN',
  description: 'Frequently asked questions about UNITFLOW JAPAN — shipping, testing, bulk orders, and sourcing.',
  alternates: { canonical: `${SITE_URL}/faq` },
}

const FAQS = [
  { q: 'Do you ship worldwide?', a: 'Yes. We ship internationally via eBay Global Shipping. Most countries are supported. Shipping rates and estimated delivery times are shown on each eBay listing.' },
  { q: 'Are items tested before shipping?', a: 'Items listed as "Tested" have been individually verified in a working system. Items listed as "Untested" or "For Parts" are clearly marked and priced accordingly. We never list untested items as tested.' },
  { q: 'Can I request bulk orders?', a: 'Yes. We regularly supply repair shops, schools, server builders, and resellers. Use our Bulk Orders page to send an inquiry with your parts list and quantities.' },
  { q: 'Do you combine shipping?', a: "Combined shipping discounts are available on eBay when purchasing multiple items. Use eBay's cart feature to add items, and the combined rate will be calculated automatically." },
  { q: 'Can you source specific parts?', a: "We receive large corporate PC lots regularly. If you need specific models (CPU generation, socket, memory type), contact us through the inquiry form and we'll check upcoming inventory." },
  { q: 'What brands do you carry?', a: 'Primarily OEM parts from HP, Dell, Lenovo, and Fujitsu business desktops. CPU brands include Intel (Core i3/i5/i7, Xeon) and AMD. Memory is Samsung, Hynix, Micron.' },
  { q: 'How do I purchase?', a: "All purchases are made through eBay. Click 'Buy on eBay' on any product page. Payment is handled securely through eBay's checkout system." },
  { q: 'Do you sell outside eBay?', a: 'For buyer protection and policy compliance, all purchases are completed through our official eBay listings. We do not accept direct payment, PayPal, or off-platform transactions.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="bg-bg-secondary border border-white/10 rounded p-6">
              <h2 className="text-white font-medium mb-3">{faq.q}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
