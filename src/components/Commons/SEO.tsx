import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  domain?: string;
}

const DEFAULT_TITLE = 'What Exchange';
const DEFAULT_DESCRIPTION = 'What Exchange Desc';
const DEFAULT_IMAGE =
  'https://opengraph.b-cdn.net/production/images/8114e0cd-f577-4898-b01d-ee630c0b3222.png?token=OENDZ31ZgZfNQlF_kRNBMCF-QEL8lhpU6Qc0kDSmgdg&height=256&width=256&expires=33285106981';
const DEFAULT_URL = 'https://app-lms.focalfossa.site/';
const DEFAULT_TYPE = 'website';
const DEFAULT_DOMAIN = 'app-lms.focalfossa.site';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
  type = DEFAULT_TYPE,
  domain = DEFAULT_DOMAIN,
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={domain} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
