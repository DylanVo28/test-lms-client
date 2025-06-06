import Head from 'next/head';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  imageUrl: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, imageUrl }) => {
  console.log({
    title,
    description,
    imageUrl,
  });
  return (
    <Head>
      {/* <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content="https://app-lms.focalfossa.site/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="app-lms.focalfossa.site" />
      <meta property="twitter:url" content="https://app-lms.focalfossa.site/" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} /> */}

      <title>test</title>
      <meta name="description" content="test desc" />

      <meta
        property="og:url"
        content="https://app-lms.focalfossa.site/d1kol/course/8836c274-18a5-4150-a890-24dec20384ed"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="test" />
      <meta property="og:description" content="test desc" />
      <meta
        property="og:image"
        content="https://opengraph.b-cdn.net/production/images/8114e0cd-f577-4898-b01d-ee630c0b3222.png?token=vS1DNTtBoV0cv-DWxxFWLr-O58oE2i5jhmOX_gVjeQA&height=256&width=256&expires=33285192952"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="app-lms.focalfossa.site" />
      <meta
        property="twitter:url"
        content="https://app-lms.focalfossa.site/d1kol/course/8836c274-18a5-4150-a890-24dec20384ed"
      />
      <meta name="twitter:title" content="test" />
      <meta name="twitter:description" content="test desc" />
      <meta
        name="twitter:image"
        content="https://opengraph.b-cdn.net/production/images/8114e0cd-f577-4898-b01d-ee630c0b3222.png?token=vS1DNTtBoV0cv-DWxxFWLr-O58oE2i5jhmOX_gVjeQA&height=256&width=256&expires=33285192952"
      />
    </Head>
  );
};

export default SEO;
