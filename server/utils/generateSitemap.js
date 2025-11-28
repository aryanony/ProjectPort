// server/utils/generateSitemap.js
const fs = require("fs");
const path = require("path");

const DOMAIN = "https://projectsport.vercel.app"; // Replace with your actual domain

// Static routes with priority and change frequency
const staticRoutes = [
  {
    path: "/",
    priority: 1.0,
    changefreq: "daily",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/start-project",
    priority: 0.9,
    changefreq: "weekly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/login",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/register",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString(),
  },
];

// Generate XML sitemap
function generateXMLSitemap(routes) {
  const urlset = routes
    .map(
      (route) => `
  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlset}
</urlset>`;
}

// Generate HTML sitemap
function generateHTMLSitemap(routes) {
  const links = routes
    .map(
      (route) => `
    <li>
      <a href="${route.path}" class="sitemap-link">
        ${
          route.path === "/"
            ? "Home"
            : route.path
                .split("/")
                .filter(Boolean)
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(" ")
        }
      </a>
      <span class="sitemap-meta">Priority: ${route.priority} | Update: ${
        route.changefreq
      }</span>
    </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap - ProjectPort</title>
  <meta name="robots" content="noindex, follow">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #1a202c;
      font-size: 2.5rem;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .subtitle {
      color: #718096;
      font-size: 1.1rem;
      margin-bottom: 40px;
    }
    .section-title {
      color: #2d3748;
      font-size: 1.5rem;
      margin: 32px 0 16px 0;
      font-weight: 600;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 8px;
    }
    ul {
      list-style: none;
    }
    li {
      margin: 16px 0;
      padding: 16px;
      background: #f7fafc;
      border-radius: 8px;
      transition: all 0.3s ease;
      border-left: 4px solid #6366f1;
    }
    li:hover {
      background: #edf2f7;
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    }
    .sitemap-link {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      display: block;
      margin-bottom: 4px;
    }
    .sitemap-link:hover {
      color: #4f46e5;
      text-decoration: underline;
    }
    .sitemap-meta {
      color: #a0aec0;
      font-size: 0.85rem;
    }
    .footer {
      text-align: center;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      color: #718096;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📍 ProjectPort Sitemap</h1>
    <p class="subtitle">Browse all available pages on ProjectPort</p>
    
    <h2 class="section-title">Main Pages</h2>
    <ul>
      ${links}
    </ul>
    
    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</p>
      <p style="margin-top: 8px;">
        <a href="/">← Back to Home</a> | 
        <a href="/sitemap.xml">View XML Sitemap</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// Main function to generate both sitemaps
async function generateSitemaps() {
  try {
    const xmlSitemap = generateXMLSitemap(staticRoutes);
    const htmlSitemap = generateHTMLSitemap(staticRoutes);

    // Determine output directory (usually public folder in client)
    const outputDir = path.join(__dirname, "../../client/public");

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write XML sitemap
    fs.writeFileSync(path.join(outputDir, "sitemap.xml"), xmlSitemap, "utf8");

    // Write HTML sitemap
    fs.writeFileSync(path.join(outputDir, "sitemap.html"), htmlSitemap, "utf8");

    console.log("✅ Sitemaps generated successfully!");
    console.log(`   - XML: ${outputDir}/sitemap.xml`);
    console.log(`   - HTML: ${outputDir}/sitemap.html`);

    return { success: true };
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error);
    return { success: false, error };
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemaps();
}

module.exports = { generateSitemaps, generateXMLSitemap, generateHTMLSitemap };
