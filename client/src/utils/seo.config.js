// client/src/utils/seo.config.js
export const siteMetadata = {
  title: "ProjectPort - Professional Project Management & Development Platform",
  description:
    "Order, track, and deliver projects seamlessly. ProjectPort connects clients with expert developers through automated quotations, real-time tracking, and professional project management.",
  siteUrl: "https://projectsport.vercel.app", // Replace with your actual domain
  author: "Aryan Gupta",
  keywords: [
    "project management platform",
    "software development services",
    "web development quotation",
    "project tracking system",
    "client project portal",
    "automated quotation system",
    "project delivery platform",
    "development agency platform",
    "custom software development",
    "project management software",
  ],
  social: {
    twitter: "@projectport",
    facebook: "projectport",
    linkedin: "company/projectport",
    instagram: "projectport",
  },
  contact: {
    email: "admin@projectport.com",
    phone: "+91-6205650368",
  },
  organization: {
    name: "ProjectPort",
    logo: "/logo.png",
    address: "Patna, Bihar, India",
  },
};

// Page-specific metadata
export const pageMetadata = {
  home: {
    title:
      "ProjectPort - Order. Track. Deliver. | Professional Project Management",
    description:
      "Transform your project ideas into reality with ProjectPort. Get instant quotations, track progress in real-time, and collaborate seamlessly with expert developers.",
    keywords:
      "project management, software development, web development, automated quotation, project tracking",
    ogType: "website",
  },

  startProject: {
    title: "Start Your Project - Get Instant Quotation | ProjectPort",
    description:
      "Launch your project in minutes! Choose from web development, mobile apps, e-commerce, or custom solutions. Get automated pricing and instant quotations based on your requirements.",
    keywords:
      "start project, get quotation, project estimate, web development pricing, app development cost",
    ogType: "website",
  },

  login: {
    title: "Client Login - Access Your Projects | ProjectPort",
    description:
      "Login to your ProjectPort account to track projects, view quotations, manage milestones, and collaborate with your development team.",
    keywords: "client login, project portal, client dashboard",
    ogType: "website",
  },

  register: {
    title: "Create Account - Join ProjectPort Today",
    description:
      "Register for ProjectPort and start managing your projects professionally. Get access to automated quotations, real-time tracking, and expert development teams.",
    keywords: "sign up, create account, register, new client",
    ogType: "website",
  },

  clientDashboard: {
    title: "Client Dashboard - Manage Your Projects | ProjectPort",
    description:
      "View all your projects, track progress, manage payments, and communicate with your development team from one centralized dashboard.",
    keywords:
      "client dashboard, project overview, project management, client portal",
    ogType: "webapp",
  },

  clientProjects: {
    title: "My Projects - Track Development Progress | ProjectPort",
    description:
      "Monitor your project's progress with real-time updates, milestone tracking, payment schedules, and direct communication with your development team.",
    keywords:
      "project tracking, project progress, project milestones, development updates",
    ogType: "webapp",
  },

  adminDashboard: {
    title: "Admin Dashboard - Project Management Console | ProjectPort",
    description:
      "Comprehensive admin panel to manage clients, projects, leads, team assignments, and business analytics.",
    keywords:
      "admin dashboard, project management, team management, business analytics",
    ogType: "webapp",
  },

  adminLeads: {
    title: "Lead Management - Convert Inquiries to Projects | ProjectPort",
    description:
      "Manage incoming project inquiries, review requirements, generate quotations, and convert leads into active projects efficiently.",
    keywords:
      "lead management, project inquiries, lead conversion, sales pipeline",
    ogType: "webapp",
  },

  adminProjects: {
    title: "Project Management - Oversee All Projects | ProjectPort",
    description:
      "Monitor all active projects, assign team members, track milestones, manage payments, and ensure timely delivery.",
    keywords:
      "project administration, team assignment, project monitoring, delivery management",
    ogType: "webapp",
  },
};

// Structured Data (Schema.org)
export const generateSchemaOrg = (pageType, pageData = {}) => {
  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteMetadata.organization.name,
      url: siteMetadata.siteUrl,
      logo: `${siteMetadata.siteUrl}${siteMetadata.organization.logo}`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteMetadata.contact.phone,
        contactType: "Customer Service",
        email: siteMetadata.contact.email,
        areaServed: "IN",
        availableLanguage: "English",
      },
      sameAs: [
        `https://twitter.com/${siteMetadata.social.twitter}`,
        `https://facebook.com/${siteMetadata.social.facebook}`,
        `https://linkedin.com/${siteMetadata.social.linkedin}`,
        `https://instagram.com/${siteMetadata.social.instagram}`,
      ],
    },

    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
      description: siteMetadata.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },

    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ProjectPort",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      operatingSystem: "Web Browser",
      description: siteMetadata.description,
    },

    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Software Development & Project Management",
      provider: {
        "@type": "Organization",
        name: siteMetadata.organization.name,
      },
      areaServed: "Worldwide",
      description:
        "Professional project management platform for software development projects",
    },

    breadcrumb: (items) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteMetadata.siteUrl}${item.path}`,
      })),
    }),
  };

  return schemas[pageType] || schemas.website;
};

// Generate canonical URL
export const getCanonicalUrl = (path) => {
  return `${siteMetadata.siteUrl}${path}`;
};

// Generate Open Graph tags
export const generateOGTags = (page) => {
  const metadata = pageMetadata[page] || pageMetadata.home;
  return {
    "og:title": metadata.title,
    "og:description": metadata.description,
    "og:type": metadata.ogType,
    "og:url": getCanonicalUrl(window.location.pathname),
    "og:site_name": siteMetadata.title,
    "og:image": `${siteMetadata.siteUrl}/og-image.png`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:locale": "en_IN",
  };
};

// Generate Twitter Card tags
export const generateTwitterTags = (page) => {
  const metadata = pageMetadata[page] || pageMetadata.home;
  return {
    "twitter:card": "summary_large_image",
    "twitter:site": siteMetadata.social.twitter,
    "twitter:creator": siteMetadata.social.twitter,
    "twitter:title": metadata.title,
    "twitter:description": metadata.description,
    "twitter:image": `${siteMetadata.siteUrl}/twitter-card.png`,
  };
};
