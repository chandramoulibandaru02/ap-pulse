/**
 * Seed script to populate sample Andhra Pradesh news articles into Firestore.
 * 
 * Usage:
 *   node scripts/seed.mjs
 */

import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found!');
  process.exit(1);
}

const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SAMPLE_ARTICLES = [
  {
    title: "Amaravati Capital Works Accelerated with World Bank & ADB Funding",
    slug: "amaravati-capital-works-accelerated-world-bank-adb-funding",
    excerpt: "Infrastructure development in Andhra Pradesh's capital Amaravati gains strong momentum as financial institutions greenlight initial tranches for arterial roads and administrative complexes.",
    content: "<p>The Andhra Pradesh Capital Region Development Authority (APCRDA) has initiated tenders for key trunk infrastructure works across the seed capital area in Amaravati.</p><p>State ministers confirmed that international lenders including the World Bank and Asian Development Bank have approved the first phase of funding aimed at flood mitigation, four-lane connectivity, and smart utility ducts.</p><blockquote>This will transform Amaravati into a sustainable, future-ready administrative and knowledge hub for the people of Andhra Pradesh.</blockquote><p>Farmers who participated in the land pooling scheme expressed satisfaction with the renewed pace of work and development clearances.</p>",
    featuredImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Construction planning and development in Amaravati region",
    category: "politics",
    district: "guntur",
    author: "K. Rama Rao",
    status: "published",
    breakingNews: true,
    seoTitle: "Amaravati Capital Works Accelerated with World Bank Funding",
    seoDescription: "World Bank and ADB financial backing kicks off major infrastructure tenders in Amaravati.",
    keywords: ["Amaravati", "Andhra Pradesh", "CRDA", "World Bank", "Capital"],
    canonicalUrl: "",
  },
  {
    title: "Visakhapatnam Emerges as Premier AI & Fintech Center with Global Tech Inflow",
    slug: "visakhapatnam-emerges-as-premier-ai-fintech-center",
    excerpt: "The port city of Visakhapatnam witnesses a surge in IT parks and research labs as leading technology companies expand operations in Rushikonda and Madhurawada.",
    content: "<p>Visakhapatnam is rapidly cementing its reputation as Andhra Pradesh's premier technology and executive powerhouse. With top software firms establishing data centers and AI research facilities, the coastal city is drawing engineering talent from across the country.</p><p>The state government has announced special incentives for startup incubators and semiconductor design centers aiming to establish operations in the Millennium Towers and IT SEZ.</p><p>City officials also highlighted ongoing airport expansion and beach corridor enhancement projects to support business travel and tourism.</p>",
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Rushikonda IT corridor in Visakhapatnam",
    category: "technology",
    district: "visakhapatnam",
    author: "S. Ananya",
    status: "published",
    breakingNews: false,
    seoTitle: "Visakhapatnam IT & Fintech Hub Expansion",
    seoDescription: "Visakhapatnam sees significant investment in IT parks and AI centers across Rushikonda.",
    keywords: ["Visakhapatnam", "Vizag IT", "Fintech", "Technology", "Rushikonda"],
    canonicalUrl: "",
  },
  {
    title: "Tirumala Brahmotsavams: TTD Gears Up for Grand Celebrations with Enhanced Pilgrim Facilities",
    slug: "tirumala-brahmotsavams-ttd-gears-up-for-grand-celebrations",
    excerpt: "Tirumala Tirupati Devasthanams (TTD) completes arrangements for the annual Brahmotsavam festivities, introducing AI-based queue management and specialized medical camps.",
    content: "<p>Tens of thousands of devotees are expected to assemble in the holy hill town of Tirumala for the annual Srivari Brahmotsavams. TTD authorities have finalized security, accommodation, and crowd management protocols.</p><p>Automated laddu distribution centers and optical camera tracking systems have been deployed along the four Mada streets to ensure seamless movement of pilgrims during vahana sevas.</p><p>Free meal distribution (Annaprasadam) facilities will operate round-the-clock throughout the festive period.</p>",
    featuredImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Pilgrims at the sacred shrine of Tirumala",
    category: "andhra-pradesh",
    district: "tirupati",
    author: "P. Venkat",
    status: "published",
    breakingNews: false,
    seoTitle: "TTD Brahmotsavams Arrangements in Tirumala",
    seoDescription: "TTD finalizes queue arrangements and devotee amenities for annual Tirumala Brahmotsavams.",
    keywords: ["Tirupati", "TTD", "Brahmotsavams", "Tirumala", "Andhra Pradesh"],
    canonicalUrl: "",
  },
  {
    title: "Andhra Pradesh Ranji Squad Unveiled with New Talent Ahead of National Championship",
    slug: "andhra-pradesh-ranji-squad-unveiled-new-talent",
    excerpt: "The Andhra Cricket Association (ACA) announces a dynamic 16-member squad focusing on young pacers and reliable middle-order batting for the upcoming season.",
    content: "<p>The Andhra Cricket Association has announced the squad for the premier domestic tournament, introducing three promising youngsters from district leagues in Kadapa and East Godavari.</p><p>Head coaches emphasized rigorous conditioning camps in Mangalagiri and simulated match pressure to ensure peak performance against traditional heavyweights.</p>",
    featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Cricket action during state training camp",
    category: "sports",
    district: "ntr",
    author: "R. Naidu",
    status: "published",
    breakingNews: false,
    seoTitle: "Andhra Ranji Trophy Squad Announcement",
    seoDescription: "ACA reveals team lineup with young bowling talent for domestic cricket championship.",
    keywords: ["Cricket", "Andhra Sports", "Ranji Trophy", "ACA"],
    canonicalUrl: "",
  }
];

async function seed() {
  console.log(`Connecting to Firebase project: ${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}...`);
  const col = collection(db, 'articles');
  
  for (const item of SAMPLE_ARTICLES) {
    const now = Timestamp.now();
    try {
      const docRef = await addDoc(col, {
        ...item,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`✓ Added article: "${item.title}" (ID: ${docRef.id})`);
    } catch (err) {
      console.error(`✗ Failed to add article "${item.title}":`, err.message);
      if (err.code === 'permission-denied') {
        console.log('\nNOTE: Firestore permissions denied. Please deploy firestore.rules to Firebase Console or log in to admin to write articles.');
        break;
      }
    }
  }
  console.log('\nSeeding process completed.');
}

seed();
