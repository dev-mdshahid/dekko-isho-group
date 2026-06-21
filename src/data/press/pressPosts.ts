export type PressPost = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  image: string
  imageAlt: string
  featured?: boolean
  content: string
}

export const pressPosts: PressPost[] = [
  {
    slug: 'dekko-isho-invested-in-fashol',
    title: 'Dekko ISHO invested in Fashol: A leading agri-tech startup',
    category: 'Agri-tech startup',
    date: 'October 16, 2021',
    excerpt:
      'Dekko ISHO Technologies Ltd. (DITECH), a concern of leading conglomerate Dekko ISHO Group, has signed a monetary and strategic capital investment agreement with Fashol Dotcom Limited.',
    image: '/images/press/fashol.jpg',
    imageAlt: 'Dekko ISHO invested in Fashol signing ceremony',
    featured: true,
    content: `
      <p>Dekko ISHO Technologies Ltd. (DITECH), a concern of leading conglomerate Dekko ISHO Group, has signed a monetary and strategic capital investment agreement with Fashol Dotcom Limited, a B2B startup aiming to change the country&rsquo;s age-old perishable supply chain using technology, data, and efficient logistics.</p>
      <p>The ceremony took place at Dekko ISHO&rsquo;s corporate office and was attended by the Managing Director of DITECH, Mr. Prottoy Hossain, and Fashol Dotcom&rsquo;s Founder &amp; CEO Mr. Sakib Hossain as well as the co-founder Mr. Mamunur Rashid.</p>
      <p>&ldquo;Lack of food security is unfortunately one of the biggest global crises of our times, and Fashol has the potential to have an immense positive impact on this issue, nationally, and hopefully someday, globally as well.&rdquo; said Prottoy Hossain. He added &ldquo;We are proud to be a part and an enabler of their endeavors, and hope to work together for a long time in our efforts to create a better world&rdquo;.</p>
      <blockquote><p>&ldquo;Lack of food security is unfortunately one of the biggest global crises of our times, and Fashol has the potential to have an immense positive impact on this issue, nationally, and hopefully someday, globally as well.&rdquo;</p><p>&mdash; Prottoy Hossain, Director, Dekko ISHO Group</p></blockquote>
      <p>The key vision of Fashol is creating value for the agri ecosystem of Bangladesh. Their business provides higher profit margins &amp; on time payments to the farmers, doorstep delivery for customers, hygienic vegetables &amp; fruits, &amp; hassle-free business for the retailers, and additionally traceable and safe food for the consumers.</p>
      <p>&ldquo;Agri sector is one of the biggest economic drivers of our country. That being said, the whole ecosystem is still working as it was 150 years ago. We need to put more resources and talents in this sector to get this whole ecosystem ready for the next technological era.&rdquo; said Sakib Hossain, CEO and Founder of the venture. &ldquo;We have been fortunate to get the chance to work with such a remarkable team and the partnership we have received from Dekko ISHO Group. This took us a big stride forward to fulfill our ultimate vision with Dekko ISHO.&rdquo; he added.</p>
      <blockquote><p>&ldquo;We want to bring the power of technology in the agri eco-system.&rdquo;</p><p>&mdash; Sakib Hossain, Founder &amp; CEO, Fashol Dotcom Ltd.</p></blockquote>
      <p>Fashol Dotcom started their journey in October 2020, and have successfully distributed around 1.5 million kgs of vegetables and fruits among retailers.</p>
      <p>The signing ceremony took place on 16th October, which is observed worldwide as World Food Day 2021, which was also celebrated by the company through the distribution of lunch meals to 2000 less fortunate individuals, while Fashol provided grocery packs for 500 individuals. This initiative was undertaken in partnership with the non-profit organization Bidyanondo Foundation.</p>
    `,
  },
  {
    slug: 'signing-ceremony-of-dekko-isho-group-markopolo-ai',
    title: 'Signing Ceremony of DEKKO ISHO Group & Markopolo.AI',
    category: 'Technology',
    date: 'August 10, 2021',
    excerpt:
      'A Signing Ceremony was held between DEKKO ISHO Group & Markopolo.Ai at Dekko ISHO Corporate Office, Suvastu Zenim Plaza, House no.37, Road 16.',
    image: '/images/press/markopolo-banner.png',
    imageAlt: 'Signing ceremony banner for Dekko ISHO Group and Markopolo.ai',
    content: `
      <p>A Signing Ceremony was held between DEKKO ISHO Group &amp; Markopolo.Ai at Dekko ISHO Corporate Office, Suvastu Zenim Plaza, House no.37, Road 16 (Old).</p>
      <p>The ceremony marked a strategic partnership between Dekko ISHO Group and Markopolo.ai, bringing together one of Bangladesh&rsquo;s leading conglomerates and a deep tech startup providing cloud-based digital advertising automation for businesses worldwide.</p>
    `,
  },
  {
    slug: 'signing-ceremony-for-dekko-isho-group-and-markopolo-ai',
    title: 'Signing ceremony for Dekko ISHO Group and Markopolo.ai',
    category: 'Technology',
    date: 'August 10, 2021',
    excerpt:
      'Dekko ISHO Group, a diverse business conglomerate and market leader in various industries in Bangladesh, has invested in Markopolo.ai as an institutional investor in their pre-seed round.',
    image: '/images/press/markopolo-signing.jpg',
    imageAlt: 'Signing ceremony for Dekko ISHO Group and Markopolo.ai',
    content: `
      <p>Dekko ISHO Group, a diverse business conglomerate and market leader in various industries in Bangladesh, has invested in Markopolo.ai as an institutional investor in their pre-seed round. The signing ceremony was attended by Prottoy Hossain, Director, of Dekko Isho Group along with the founders of Markopolo, Tasfia Tasbin, CEO, Rubaiyat Farhan, COO, and Zaman, CTO. Markopolo.ai, a deep tech startup headquartered in Delaware, USA, provides businesses a cloud-based software which can put their digital advertising on autopilot.</p>
      <p>Tasfia Tasbin, Co-founder and CEO said &ldquo;It&rsquo;s an end to end digital marketing solution mimicking what an agency can serve, being more data-driven, personalized and cost-efficient for businesses.&rdquo;</p>
      <blockquote><p>&ldquo;We are excited to diversify our business portfolio, while contributing to the disruptive growth of the IT industry of Bangladesh, and we are looking forward to see where this partnership takes us&rdquo;.</p><p>&mdash; Prottoy Hossain, Director of Dekko ISHO</p></blockquote>
      <p>Markopolo.ai currently serves a variety of corporations, small businesses, and eCommerce business owners around the globe. Dekko ISHO Group&rsquo;s trust in this futuristic venture is an indication that accomplished and veteran market leaders see the potential of AI in the field of marketing and the prospect it has in the country.</p>
      <p><em>Source: The Daily Star</em></p>
    `,
  },
  {
    slug: 'dekko-isho-group-invests-in-ecovia',
    title: 'Dekko ISHO Group invests in Ecovia: A green tech startup',
    category: 'Ecovia',
    date: 'August 10, 2021',
    excerpt:
      'Ecovia&rsquo;s key vision is to tackle the irresponsible consumerism causing climate crisis, by bringing eco-friendly alternatives to single-use plastics.',
    image: '/images/press/ecovia.jpg',
    imageAlt: 'Dekko ISHO Group invests in Ecovia signing ceremony',
    content: `
      <p>Ecovia&rsquo;s key vision is to tackle the irresponsible consumerism causing climate crisis, by bringing eco-friendly alternatives to single-use plastics. Dekko ISHO Group, one of the leading business conglomerates in Bangladesh, has invested in Ecovia as part of its commitment to sustainable and responsible business practices.</p>
      <p>The investment supports Ecovia&rsquo;s mission to replace single-use plastics with eco-friendly alternatives and contribute to a more sustainable future for Bangladesh and beyond.</p>
    `,
  },
  {
    slug: 'dekko-isho-group-joins-hands-with-markopolo-ai-to-contribute-to-it-industry-growth',
    title: 'Dekko ISHO Group joins hands with Markopolo.ai to contribute to IT industry growth',
    category: 'Technology',
    date: 'August 10, 2021',
    excerpt:
      'Dekko ISHO Group, a diverse business entity, has invested in Markopolo.ai as an institutional investor in their pre-seed round to contributing to the growth of the IT industry.',
    image: '/images/press/markopolo-joins.png',
    imageAlt: 'Dekko ISHO Group joins hands with Markopolo.ai',
    content: `
      <p>Dekko ISHO Group, a diverse business entity, has invested in Markopolo.ai as an institutional investor in their pre-seed round to contributing to the growth of the IT industry in Bangladesh.</p>
      <p>Markopolo.ai provides an AI-powered marketing automation platform that helps businesses run data-driven digital advertising campaigns with greater efficiency and personalization.</p>
      <p>Through this partnership, Dekko ISHO Group aims to support the growth of deep tech startups in Bangladesh and contribute to the digital transformation of the country&rsquo;s business landscape.</p>
    `,
  },
]

export function getPressPostBySlug(slug: string) {
  return pressPosts.find((post) => post.slug === slug)
}

export function getFeaturedPressPost() {
  return pressPosts.find((post) => post.featured) ?? pressPosts[0]
}

export function getTopRowPosts() {
  const featured = getFeaturedPressPost()
  return pressPosts.filter((post) => post.slug !== featured.slug).slice(0, 2)
}

export function getBottomRowPosts() {
  const featured = getFeaturedPressPost()
  const topRow = getTopRowPosts()
  const usedSlugs = new Set([featured.slug, ...topRow.map((post) => post.slug)])
  return pressPosts.filter((post) => !usedSlugs.has(post.slug))
}

export function getRecentPressPosts(excludeSlug?: string, limit = 3) {
  return pressPosts.filter((post) => post.slug !== excludeSlug).slice(0, limit)
}
