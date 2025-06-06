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
      <title>{title}</title>
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
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default SEO;
