import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  type = 'website', 
  image, 
  noindex = false 
}) => {
  const siteName = 'GigsConnect';
  const defaultTitle = 'GigsConnect Africa | Connecting Talent with Opportunity';
  const defaultDescription = 'GigsConnect is the premier platform connecting African creators, freelancers, and talent with top gig opportunities, collaborations, and brands.';
  const defaultImage = 'https://gigsconnect.africa/default-og-image.jpg'; // We can update this based on existing assets if needed

  const seoTitle = title ? `\${title} | \${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={seoImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};
