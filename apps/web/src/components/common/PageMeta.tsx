import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
}

export function PageMeta({ title }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Trusted by industries worldwide for quality manufacturing, advanced technology, and timely delivery."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Trusted by industries worldwide for quality manufacturing, advanced technology, and timely delivery."
      />
      <meta
        property="og:image"
        content="https://cdn.prod.website-files.com/6a26a190936d1b3aae320bc8/6a26a196936d1b3aae320ec1_open-graph-(1).jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content="Trusted by industries worldwide for quality manufacturing, advanced technology, and timely delivery."
      />
    </Helmet>
  )
}
