// src/utils/priceEngine.js
// Pricing engine based on your Excel data (INR).
// Exports helpers for UI, lists & estimates.

const pricingTable = {
  portfolio: {
    label: "Portfolio / Business Website",
    techs: ["React", "Next.js", "Tailwind"],
    range: [35000, 70000],
    note: "5–10 pages, responsive, SEO setup",
    deliverables: ["Home", "About", "Services", "Contact", "SEO Setup"],
  },
  corporate: {
    label: "Corporate / Informational Website",
    techs: ["React", "Next.js"],
    range: [60000, 120000],
    note: "Dynamic content, blog, multi-language",
    deliverables: ["CMS", "Blog", "Multi-language"],
  },
  ecommerce: {
    label: "E-Commerce Website",
    techs: ["Next.js", "React + Node", "MongoDB/Postgres"],
    range: [120000, 350000],
    note: "Advanced cart, payment, product filters, analytics",
    deliverables: ["Product Management", "Cart", "Payments", "Admin"],
  },
  transactional: {
    label: "Transactional Website",
    techs: ["MERN", "Next.js SaaS"],
    range: [150000, 400000],
    note: "Secure transactions, dashboards",
    deliverables: ["Payments", "Reports", "Admin Dashboards"],
  },
  saas: {
    label: "SaaS Platform",
    techs: ["React/Next + Node/Nest + Cloud"],
    range: [250000, 700000],
    note: "Subscription system, dashboards, integrations",
    deliverables: ["Subscriptions", "Admin", "Billing", "Integrations"],
  },

  // apps
  "basic-app": {
    label: "Basic Business App",
    techs: ["Flutter"],
    range: [100000, 250000],
    note: "Static info, forms, push notifications",
  },
  "ecom-app": {
    label: "E-Commerce App",
    techs: ["Flutter + Firebase", "Node"],
    range: [250000, 500000],
    note: "Orders, cart, payments, user accounts",
  },
  "enterprise-app": {
    label: "SaaS / Enterprise App",
    techs: ["Flutter + Node/Nest + APIs"],
    range: [300000, 800000],
    note: "Role-based, analytics, high scalability",
  },

  // web3
  "sm15000art-contract": {
    label: "Smart Contract (ERC20)",
    range: [3, 450000],
  },
  "nft-marketplace": { label: "NFT Marketplace", range: [300000, 1000000] },
  dapp: { label: "DApp", range: [200000, 2500000] },
  wallet: {
    label: "Crypto Wallet / Exchange Integration",
    range: [100000, 300000],
  },

  // marketing / maintenance (guides)
  seo: { label: "SEO (monthly)", range: [15000, 40000], recurring: true },
  smm: {
    label: "Social Media Marketing (monthly)",
    range: [20000, 60000],
    recurring: true,
  },
  "maint-basic": {
    label: "Maintenance Basic (monthly)",
    range: [3000, 7000],
    recurring: true,
  },
  "maint-standard": {
    label: "Maintenance Standard (monthly)",
    range: [10000, 25000],
    recurring: true,
  },
  "maint-premium": {
    label: "Maintenance Premium (monthly)",
    range: [40000, 100000],
    recurring: true,
  },
};

const addOns = {
  "ui-design": { label: "UI Design", type: "percent", pct: 8 }, // +8%
  branding: { label: "Logo & Branding", type: "flat", amt: 8000 },
  content: { label: "Content Writing", type: "flat", amt: 5000 },
  "seo-setup": { label: "SEO Setup", type: "flat", amt: 12000 },
  analytics: { label: "Analytics & Tracking", type: "flat", amt: 5000 },
  "priority-support": {
    label: "Priority Support (monthly)",
    type: "flat",
    amt: 10000,
  },
  "payment-integration": {
    label: "Payment Gateway Integration",
    type: "flat",
    amt: 12000,
  },
  "multi-language": {
    label: "Multi-language Support",
    type: "percent",
    pct: 7,
  },
};

// helpers
export function getPriceRangeForType(typeKey) {
  const node = pricingTable[typeKey];
  if (!node) return [0, 0];
  return node.range || [0, 0];
}

export function getTypeLabel(typeKey) {
  return pricingTable[typeKey]?.label ?? typeKey;
}

export function listProjectTypes() {
  const arr = [
    { key: "portfolio", tag: "WEB", accent: "blue" },
    { key: "corporate", tag: "WEB", accent: "indigo" },
    { key: "ecommerce", tag: "COMMERCE", accent: "emerald" },
    { key: "transactional", tag: "TRANSACTION", accent: "orange" },
    { key: "saas", tag: "SAAS", accent: "purple" },
    { key: "basic-app", tag: "APP", accent: "cyan" },
    { key: "enterprise-app", tag: "ENTERPRISE", accent: "rose" },
    { key: "smart-contract", tag: "CRYPTO", accent: "amber" },
  ];
  return arr.map((p) => ({ ...p, label: pricingTable[p.key]?.label ?? p.key }));
}

export const availableAddOns = addOns;
export const pricingCatalog = pricingTable;

// main estimate function with breakdown
export function calculateEstimate({
  typeKey,
  selectedTech = "",
  addons = [],
  customMultiplier = 1,
  modules = [],
}) {
  const [minBase, maxBase] = getPriceRangeForType(typeKey);
  const baseMid = Math.round((minBase + maxBase) / 2);

  // tech multiplier heuristics
  let techMultiplier = 1;
  const tech = selectedTech?.toLowerCase?.() ?? "";
  if (tech.includes("node") || tech.includes("nest")) techMultiplier += 0.06;
  if (tech.includes("next") || tech.includes("react")) techMultiplier += 0.02;
  if (tech.includes("cloud") || tech.includes("aws") || tech.includes("gcp"))
    techMultiplier += 0.08;
  // blockchain heavy
  if (
    typeKey.startsWith("smart") ||
    typeKey === "nft-marketplace" ||
    tech.includes("solidity")
  )
    techMultiplier += 0.2;

  // modules: small add per module (heuristic)
  const moduleFlat = (modules?.length || 0) * 5000;

  let addFlat = 0;
  let addPct = 0;
  const usedAddons = [];

  addons.forEach((k) => {
    const a = addOns[k];
    if (!a) return;
    usedAddons.push({ key: k, ...a });
    if (a.type === "flat") addFlat += a.amt;
    if (a.type === "percent") addPct += a.pct;
  });

  // base after tech & custom multiplier
  const baseAfterTech = Math.round(baseMid * techMultiplier * customMultiplier);

  // percent additions
  const pctAmount = Math.round((baseAfterTech * addPct) / 100);

  const final = baseAfterTech + addFlat + pctAmount + moduleFlat;

  // for suggestion range
  const suggestedMin = Math.round(minBase * techMultiplier * customMultiplier);
  const suggestedMax = Math.round(
    maxBase * techMultiplier * customMultiplier +
      addFlat +
      pctAmount +
      moduleFlat
  );

  return {
    base: baseAfterTech,
    addonsFlat: addFlat,
    addonsPct: addPct,
    addonsApplied: usedAddons,
    moduleFlat,
    pctAmount,
    final,
    suggestedMin,
    suggestedMax,
    techMultiplier,
  };
}
