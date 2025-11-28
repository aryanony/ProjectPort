// client/src/components/SEO.jsx
// React 19 Compatible - Uses native DOM manipulation instead of react-helmet-async
import { useEffect } from 'react';
import { 
  siteMetadata, 
  pageMetadata, 
  generateSchemaOrg, 
  getCanonicalUrl,
  generateOGTags,
  generateTwitterTags 
} from '../utils/seo.config';

const SEO = ({ 
  page = 'home', 
  title, 
  description, 
  keywords,
  image,
  schemaType,
  breadcrumbs,
  noindex = false 
}) => {
  useEffect(() => {
    // Get page-specific metadata
    const pageMeta = pageMetadata[page] || pageMetadata.home;
    
    // Override with custom values if provided
    const finalTitle = title || pageMeta.title;
    const finalDescription = description || pageMeta.description;
    const finalKeywords = keywords || pageMeta.keywords;
    
    // Generate tags
    const ogTags = generateOGTags(page);
    const twitterTags = generateTwitterTags(page);
    const canonicalUrl = getCanonicalUrl(window.location.pathname);
    
    // Update document title
    document.title = finalTitle;
    
    // Function to set or update meta tag
    const setMetaTag = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Function to set or update link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };
    
    // Primary Meta Tags
    setMetaTag('title', finalTitle);
    setMetaTag('description', finalDescription);
    setMetaTag('keywords', Array.isArray(finalKeywords) ? finalKeywords.join(', ') : finalKeywords);
    setMetaTag('author', siteMetadata.author);
    
    // Robots
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }
    
    // Canonical URL
    setLinkTag('canonical', canonicalUrl);
    
    // Open Graph Tags
    setMetaTag('og:title', ogTags["og:title"], true);
    setMetaTag('og:description', ogTags["og:description"], true);
    setMetaTag('og:type', ogTags["og:type"], true);
    setMetaTag('og:url', ogTags["og:url"], true);
    setMetaTag('og:site_name', ogTags["og:site_name"], true);
    setMetaTag('og:image', image || ogTags["og:image"], true);
    setMetaTag('og:image:width', ogTags["og:image:width"], true);
    setMetaTag('og:image:height', ogTags["og:image:height"], true);
    setMetaTag('og:locale', ogTags["og:locale"], true);
    
    // Twitter Tags
    setMetaTag('twitter:card', twitterTags["twitter:card"]);
    setMetaTag('twitter:site', twitterTags["twitter:site"]);
    setMetaTag('twitter:creator', twitterTags["twitter:creator"]);
    setMetaTag('twitter:title', twitterTags["twitter:title"]);
    setMetaTag('twitter:description', twitterTags["twitter:description"]);
    setMetaTag('twitter:image', image || twitterTags["twitter:image"]);
    
    // Theme color
    setMetaTag('theme-color', '#6366f1');
    setMetaTag('msapplication-TileColor', '#6366f1');
    
    // Geo tags
    setMetaTag('geo.region', 'IN-BR');
    setMetaTag('geo.placename', 'Patna');
    setMetaTag('geo.position', '25.5941;85.1376');
    setMetaTag('ICBM', '25.5941, 85.1376');
    
    // Structured Data
    const schemas = [
      generateSchemaOrg('organization'),
      generateSchemaOrg('website')
    ];
    
    if (schemaType) {
      schemas.push(generateSchemaOrg(schemaType));
    }
    
    if (breadcrumbs) {
      schemas.push(generateSchemaOrg('breadcrumb', breadcrumbs));
    }
    
    // Remove existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
    
    // Add new schema scripts
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
    
    // Cleanup function
    return () => {
      // Optional: Clean up if needed when component unmounts
    };
  }, [page, title, description, keywords, image, schemaType, breadcrumbs, noindex]);
  
  return null; // This component doesn't render anything
};

export default SEO;