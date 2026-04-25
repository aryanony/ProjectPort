# 🎨 ProjectPort Frontend

Modern, responsive React application for the ProjectPort platform. Built with Vite, Tailwind CSS, and optimized for performance and SEO.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Components](#components)
- [Pages](#pages)
- [SEO & PWA](#seo--pwa)
- [Styling](#styling)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## 🎯 Overview

The ProjectPort frontend is a single-page application (SPA) that provides intuitive interfaces for clients and administrators to manage projects throughout their lifecycle. It features a dynamic project wizard, real-time updates, and comprehensive dashboards.

### Key Highlights

- ⚡ Lightning-fast with Vite
- 📱 Fully responsive design
- 🎨 Beautiful UI with Tailwind CSS
- ♿ Accessible components
- 🔍 SEO optimized
- 📲 PWA ready
- 🚀 Optimized performance

---

## ✨ Features

### User Features

- **Dynamic Project Wizard**: Multi-step form with intelligent field dependencies
- **Real-time Pricing**: Instant quotation calculation as users make selections
- **Project Tracking**: Live updates on project status, milestones, and deliverables
- **Payment Management**: View payment schedules, invoices, and history
- **Notification Center**: In-app notifications for important updates
- **Document Management**: Access project files and deliverables

### Admin Features

- **Lead Management**: Review and convert inquiries to projects
- **Project Dashboard**: Comprehensive overview of all projects
- **Client Management**: Track client information and project history
- **Team Assignment**: Assign projects to development teams
- **Analytics**: Business metrics and performance indicators

### Technical Features

- **Lazy Loading**: Components loaded on-demand for faster initial load
- **Code Splitting**: Optimized bundle sizes
- **Offline Support**: PWA capabilities for offline access
- **SEO**: Meta tags, structured data, sitemaps
- **Performance**: Lighthouse score 90+

---

## 🛠️ Tech Stack

| Category       | Technology         | Version |
| -------------- | ------------------ | ------- |
| **Framework**  | React              | 18.2.0  |
| **Build Tool** | Vite               | 5.x     |
| **Styling**    | Tailwind CSS       | 3.x     |
| **Routing**    | React Router       | 6.x     |
| **HTTP**       | Fetch API          | -       |
| **Icons**      | Lucide React       | Latest  |
| **SEO**        | React Helmet Async | 2.x     |
| **Forms**      | Custom Validation  | -       |

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm 9+
- Backend server running

### Steps

1. **Navigate to client directory**:

```bash
cd client
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create environment file**:

```bash
# Create .env file
touch .env
```

Add the following:

```env
VITE_API_URL=http://localhost:4000
VITE_SITE_URL=http://localhost:5173
```

4. **Start development server**:

```bash
npm run dev
```

Application will run at: `http://localhost:5173`

---

## 📁 Project Structure

```
client/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt             # SEO robots
│   ├── sitemap.xml            # XML sitemap
│   ├── sitemap.html           # HTML sitemap
│   ├── icon.svg               # App icon
│   └── icons/                 # PWA icons (multiple sizes)
│
├── src/
│   ├── assets/
│   │   └── logo/
│   │       ├── logo.svg       # Full logo
│   │       ├── logo.png
│   │       ├── icon.svg       # Icon only
│   │       └── icon.png
│   │
│   ├── components/
│   │   ├── SEO.jsx            # SEO meta tags component
│   │   ├── ProjectForm.jsx     # Multi-step project form
│   │   ├── ProjectTypeCard.jsx # Project type selector
│   │   ├── SidebarPricing.jsx  # Real-time pricing calculator
│   │   └── RecentSubmissions.jsx
│   │
│   ├── layout/
│   │   ├── Header.jsx         # Navigation bar
│   │   └── Footer.jsx         # Footer component
│   │
│   ├── pages/
│   │   ├── Landing.jsx        # Home page
│   │   ├── Login.jsx          # Authentication
│   │   ├── Register.jsx
│   │   ├── ClientConsole.jsx  # Project wizard
│   │   ├── ClientDashboard.jsx
│   │   ├── ClientProjects.jsx
│   │   ├── ClientProjectDetail.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLeads.jsx
│   │   ├── AdminProjects.jsx
│   │   └── AdminProjectDetail.jsx
│   │
│   ├── utils/
│   │   └── seo.config.js      # SEO configuration
│   │
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── global.css              # Global styles
│
├── .env                        # Environment variables
├── .gitignore
├── index.html                  # HTML template
├── package.json
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind configuration
```

---

## 🧩 Components

### SEO Component

Manages meta tags, Open Graph, Twitter Cards, and structured data.

```jsx
import SEO from "./components/SEO";

function MyPage() {
  return (
    <>
      <SEO
        page="home"
        title="Custom Title"
        description="Custom description"
        schemaType="website"
      />
      {/* Page content */}
    </>
  );
}
```

### ProjectForm Component

Multi-step wizard for project creation with validation and real-time pricing.

**Features**:

- Step-based navigation
- Field validation
- Dependent field logic
- Auto-save draft
- Price calculation

### ProjectTypeCard Component

Displays project types with icons and descriptions.

**Props**:

- `type`: Project type object
- `selected`: Boolean for selection state
- `onSelect`: Selection handler

### SidebarPricing Component

Shows real-time pricing breakdown as user makes selections.

**Features**:

- Live calculations
- Breakdown by category
- Total display
- Discount application

---

## 📄 Pages

### Public Pages

#### Landing Page (`/`)

- Hero section with CTA
- Features showcase
- Recent projects
- Testimonials
- Contact information

#### Start Project (`/start-project`)

- Public project wizard
- No authentication required
- Lead generation
- Instant quotation

#### Login/Register (`/login`, `/register`)

- User authentication
- Form validation
- Error handling
- Redirect after login

### Client Pages

All require authentication with `role: 'client'`

#### Client Dashboard (`/client`)

- Project overview cards
- Recent activity
- Quick stats
- Notifications

#### Client Projects (`/client/projects`)

- List of all projects
- Filter and search
- Status indicators
- Quick actions

#### Project Detail (`/client/projects/:id`)

- Full project information
- Milestone tracking
- Payment schedule
- Updates feed
- Document access

### Admin Pages

All require authentication with `role: 'admin'`

#### Admin Dashboard (`/admin`)

- Business analytics
- Charts and metrics
- Recent activity
- Quick actions

#### Lead Management (`/admin/leads`)

- Inquiry list
- Review details
- Convert to project
- Reject/Delete leads

#### Project Management (`/admin/projects`)

- All projects overview
- Status management
- Team assignment
- Bulk actions

#### Project Detail (`/admin/projects/:id`)

- Complete project info
- Add milestones
- Manage payments
- Post updates
- Assign team members

---

## 🔍 SEO & PWA

### SEO Implementation

1. **Meta Tags**: Dynamic meta tags for each page
2. **Open Graph**: Social media preview optimization
3. **Twitter Cards**: Twitter-specific meta tags
4. **Structured Data**: Schema.org JSON-LD
5. **Sitemaps**: XML and HTML sitemaps
6. **Robots.txt**: Search engine crawling rules
7. **Canonical URLs**: Prevent duplicate content
8. **Alt Text**: Images with descriptive alt text

### Using SEO Component

```jsx
import SEO from "./components/SEO";

function MyPage() {
  return (
    <>
      <SEO
        page="clientDashboard" // Predefined page configs
        title="My Custom Title" // Optional override
        description="Custom description"
        keywords={["keyword1", "keyword2"]}
        schemaType="webapp"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Dashboard", path: "/client" },
        ]}
      />
      {/* Your page content */}
    </>
  );
}
```

### PWA Features

- **Installable**: Add to home screen
- **Offline Support**: Service worker caching
- **App-like Experience**: Standalone mode
- **Push Notifications**: (Coming soon)
- **Fast Loading**: Optimized assets

### PWA Configuration

Edit `public/manifest.json`:

```json
{
  "name": "ProjectPort",
  "short_name": "ProjectPort",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366f1",
  "background_color": "#0f172a"
}
```

---

## 🎨 Styling

### Tailwind CSS

Using utility-first CSS framework with custom configuration.

**Custom Theme** (`tailwind.config.js`):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        // ... more colors
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

### CSS Variables

Global CSS variables in `global.css`:

```css
:root {
  --color-primary: #6366f1;
  --color-bg-main: #0f172a;
  --color-text-main: #f1f5f9;
  /* ... more variables */
}
```

### Responsive Design

All components are mobile-first:

```jsx
<div
  className="
  w-full          /* Mobile */
  md:w-1/2        /* Tablet */
  lg:w-1/3        /* Desktop */
  xl:w-1/4        /* Large screens */
"
>
  Content
</div>
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Start the backend** server first
2. **Run frontend** dev server
3. **Make changes** - Hot reload enabled
4. **Test** in browser
5. **Commit** changes

### Code Style

- Use functional components with hooks
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful component names
- Add comments for complex logic

### Best Practices

1. **Component Structure**:

```jsx
// Imports
import React, { useState } from "react";

// Component
const MyComponent = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div>Content</div>;
};

export default MyComponent;
```

2. **State Management**: Use hooks appropriately
3. **API Calls**: Handle loading and errors
4. **Validation**: Always validate user input
5. **Accessibility**: Use semantic HTML

---

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

Output in `dist/` directory.

### Environment Variables

Production `.env`:

```env
VITE_API_URL=https://api.projectport.com
VITE_SITE_URL=https://projectport.com
```

### Deployment Options

#### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

#### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

#### Manual Deployment

```bash
npm run build
# Upload dist/ folder to web server
```

### Performance Optimization

- **Code Splitting**: Automatic with Vite
- **Lazy Loading**: Use React.lazy()
- **Image Optimization**: Use WebP format
- **Caching**: Configure headers
- **CDN**: Use for static assets

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection failed**:

- Check backend is running
- Verify API_URL in .env
- Check CORS configuration

**Build fails**:

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

## 🤝 Contributing

See main [README.md](../README.md) for contribution guidelines.

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

<p align="center">
  Made with ❤️ for ProjectPort
</p>
