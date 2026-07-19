import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '../data/opportunities.json');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';
const GENERIC_UA = 'Mozilla/5.0 (compatible; WissenHaus/1.0)';

const NIGERIA_KEYWORDS = ['nigeria', 'nigerian'];
const AFRICA_KEYWORDS = ['africa', 'sub-saharan', 'pan-african', 'pan africa'];
const WORLDWIDE_KEYWORDS = ['anywhere', 'worldwide', 'world wide', 'global', 'any location', 'any timezone', 'no location restriction', 'international', 'open to all countries'];
const HYBRID_RELOCATE_RE = /\b(hybrid|on-?site|in-office|relocat\w*)\b/i;
const EXCLUDE_COUNTRY_KEYWORDS = ['us only', 'u.s. only', 'usa only', 'us-based', 'u.s.-based', 'us residents', 'us residents only', 'us citizens only', 'united states only', 'must be based in the us', 'must reside in the us', 'eu only', 'eu residents', 'eu-based', 'european union only', 'europe only', 'uk only', 'uk-based', 'u.k.-based', 'united kingdom only', 'canada only', 'canadian residents', 'australia only', 'germany only', 'netherlands only', 'ireland only', 'india only', 'philippines only', 'south africa only', 'kenya only', 'ghana only', 'egypt only'];

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

function normalizeUrl(url) {
  if (!url) return '';
  return url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').split('?')[0].split('#')[0];
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
}

function matchAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function checkEligibility(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  if (HYBRID_RELOCATE_RE.test(lower)) return null;
  if (matchAny(lower, NIGERIA_KEYWORDS)) return { code: 'nigeria', label: 'Open to Nigeria' };
  if (matchAny(lower, AFRICA_KEYWORDS)) return { code: 'africa', label: 'Open to Africa' };
  if (matchAny(lower, WORLDWIDE_KEYWORDS)) return { code: 'worldwide', label: 'Open Worldwide' };
  if (matchAny(lower, EXCLUDE_COUNTRY_KEYWORDS)) return null;
  return null;
}

function generateId(source, title, company) {
  const seed = `${source}-${slugify(title)}-${slugify(company)}`;
  return seed.slice(0, 60).replace(/-+$/, '');
}

async function fetchRemoteOK() {
  try {
    const res = await fetch('https://remoteok.com/api', { headers: { 'User-Agent': GENERIC_UA } });
    if (!res.ok) throw new Error(`RemoteOK: ${res.status}`);
    const data = await res.json();
    const items = data.slice(1).filter(job => job.position); // skip element 0 (legal notice)
    console.log(`RemoteOK: fetched ${items.length}`);

    return items.map(job => {
      const combined = `${job.position || ''} ${job.location || ''} ${(job.tags || []).join(' ')} ${stripHtml(job.description || '')}`.toLowerCase();
      let elig = checkEligibility(combined);

      if (!elig && job.location?.trim()) {
        elig = null;
      } else if (!elig && !job.location?.trim()) {
        elig = { code: 'unrestricted', label: 'Open Worldwide' };
      }

      if (!elig) return null;

      return {
        type: 'job',
        source: 'remoteok',
        id: job.id ? `remoteok-${job.id}` : generateId('remoteok', job.position, job.company),
        title: job.position,
        company: job.company,
        url: job.apply_url || job.url,
        datePosted: job.date ? job.date.split('T')[0] : new Date().toISOString().split('T')[0],
        firstSeenAt: new Date().toISOString(),
        expiresAt: null,
        eligibility: elig.code,
        eligibilityLabel: elig.label,
        tags: (job.tags || []).slice(0, 2)
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('RemoteOK error:', e.message);
    return [];
  }
}

function extractXmlTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
}

async function fetchWeWorkRemotely() {
  try {
    const res = await fetch('https://weworkremotely.com/remote-jobs.rss', { headers: { 'User-Agent': GENERIC_UA } });
    if (!res.ok) throw new Error(`WWR: ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    console.log(`We Work Remotely: fetched ${items.length}`);

    return items.map(item => {
      const title = extractXmlTag(item, 'title');
      const region = extractXmlTag(item, 'region').toLowerCase();
      const country = extractXmlTag(item, 'country').toLowerCase();
      const description = extractXmlTag(item, 'description');
      const pubDate = extractXmlTag(item, 'pubDate');
      const expiresAt = extractXmlTag(item, 'expires_at');
      const link = extractXmlTag(item, 'link');

      if (HYBRID_RELOCATE_RE.test(description.toLowerCase())) return null;

      let elig = null;
      if (matchAny(region, WORLDWIDE_KEYWORDS)) {
        elig = { code: 'worldwide', label: 'Open Worldwide' };
      } else if (matchAny(region, NIGERIA_KEYWORDS)) {
        elig = { code: 'nigeria', label: 'Open to Nigeria' };
      } else if (matchAny(region, AFRICA_KEYWORDS)) {
        elig = { code: 'africa', label: 'Open to Africa' };
      } else if (region && matchAny(region, EXCLUDE_COUNTRY_KEYWORDS)) {
        return null;
      } else if (!region && !country) {
        elig = { code: 'unrestricted', label: 'Open Worldwide' };
      } else {
        return null;
      }

      if (!elig) return null;

      let datePosted;
      try {
        datePosted = new Date(pubDate).toISOString().split('T')[0];
      } catch {
        datePosted = new Date().toISOString().split('T')[0];
      }

      let expiryDate = null;
      if (expiresAt) {
        try {
          expiryDate = new Date(expiresAt).toISOString();
        } catch {}
      }

      return {
        type: 'job',
        source: 'weworkremotely',
        id: `wwr-${slugify(title)}-${slugify(extractXmlTag(item, 'company'))}`,
        title,
        company: extractXmlTag(item, 'company'),
        url: link,
        datePosted,
        firstSeenAt: new Date().toISOString(),
        expiresAt: expiryDate,
        eligibility: elig.code,
        eligibilityLabel: elig.label,
        tags: extractXmlTag(item, 'category').split(',').map(s => s.trim()).slice(0, 2)
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('We Work Remotely error:', e.message);
    return [];
  }
}

async function fetchHimalayas() {
  try {
    const res = await fetch('https://himalayas.app/jobs/api', { headers: { 'User-Agent': GENERIC_UA } });
    if (!res.ok) throw new Error(`Himalayas: ${res.status}`);
    const { jobs } = await res.json();
    console.log(`Himalayas: fetched ${jobs?.length || 0}`);

    if (!Array.isArray(jobs)) return [];

    return jobs.map(job => {
      if (stripHtml(job.description + job.excerpt).match(HYBRID_RELOCATE_RE)) return null;

      const restrictions = job.locationRestrictions || [];
      let elig = null;

      if (restrictions.length === 0) {
        elig = { code: 'unrestricted', label: 'Open Worldwide' };
      } else if (restrictions.includes('Nigeria')) {
        elig = { code: 'nigeria', label: 'Open to Nigeria' };
      } else if (restrictions.includes('Africa')) {
        elig = { code: 'africa', label: 'Open to Africa' };
      } else {
        return null;
      }

      let datePosted;
      try {
        datePosted = new Date(job.pubDate * 1000).toISOString().split('T')[0];
      } catch {
        datePosted = new Date().toISOString().split('T')[0];
      }

      let expiryDate = null;
      if (job.expiryDate) {
        try {
          expiryDate = new Date(job.expiryDate * 1000).toISOString();
        } catch {}
      }

      const isInternship = /intern(ship)?/i.test(job.employmentType || '') || /intern(ship)?/i.test(job.title || '');

      return {
        type: isInternship ? 'internship' : 'job',
        source: 'himalayas',
        id: job.guid || generateId('himalayas', job.title, job.companyName),
        title: job.title,
        company: job.companyName,
        url: job.applicationLink,
        datePosted,
        firstSeenAt: new Date().toISOString(),
        expiresAt: expiryDate,
        eligibility: elig.code,
        eligibilityLabel: elig.label,
        tags: (job.categories || []).slice(0, 2)
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('Himalayas error:', e.message);
    return [];
  }
}

async function fetchArbeitnow() {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', { headers: { 'User-Agent': GENERIC_UA } });
    if (!res.ok) throw new Error(`Arbeitnow: ${res.status}`);
    const { data } = await res.json();
    console.log(`Arbeitnow: fetched ${data?.length || 0}`);

    if (!Array.isArray(data)) return [];

    return data.filter(job => job.remote === true).map(job => {
      const combined = `${job.title || ''} ${job.location || ''} ${(job.tags || []).join(' ')} ${stripHtml(job.description || '')}`.toLowerCase();
      let elig = checkEligibility(combined);

      if (!elig && job.location?.trim()) {
        elig = null;
      } else if (!elig && !job.location?.trim()) {
        elig = { code: 'unrestricted', label: 'Open Worldwide' };
      }

      if (!elig) return null;

      let datePosted;
      try {
        datePosted = new Date(job.created_at * 1000).toISOString().split('T')[0];
      } catch {
        datePosted = new Date().toISOString().split('T')[0];
      }

      const isInternship = /intern(ship)?/i.test(job.job_types?.[0] || '') || /intern(ship)?/i.test(job.title || '');

      return {
        type: isInternship ? 'internship' : 'job',
        source: 'arbeitnow',
        id: job.slug || generateId('arbeitnow', job.title, job.company_name),
        title: job.title,
        company: job.company_name,
        url: job.url,
        datePosted,
        firstSeenAt: new Date().toISOString(),
        expiresAt: null,
        eligibility: elig.code,
        eligibilityLabel: elig.label,
        tags: (job.tags || []).slice(0, 2)
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('Arbeitnow error:', e.message);
    return [];
  }
}

async function fetchDevpost() {
  try {
    const allHackathons = [];
    const perPage = 9;
    const maxPages = 6;

    for (let page = 1; page <= maxPages; page++) {
      const res = await fetch(`https://devpost.com/api/hackathons?status[]=open&page=${page}`, {
        headers: { 'User-Agent': BROWSER_UA }
      });
      if (!res.ok) break;
      const { hackathons, meta } = await res.json();
      if (!hackathons?.length) break;
      allHackathons.push(...hackathons);
      if (meta?.total_count && allHackathons.length >= meta.total_count) break;
    }

    console.log(`Devpost: fetched ${allHackathons.length}`);

    return allHackathons.filter(h => h.displayed_location?.location === 'Online').map(h => {
      let datePosted;
      try {
        const [start] = h.submission_period_dates?.split(' - ') || [];
        datePosted = new Date(start).toISOString().split('T')[0];
      } catch {
        datePosted = new Date().toISOString().split('T')[0];
      }

      return {
        type: 'competition',
        source: 'devpost',
        id: `devpost-${h.id}`,
        title: h.title,
        company: h.organization_name,
        url: h.url,
        datePosted,
        firstSeenAt: new Date().toISOString(),
        expiresAt: null,
        eligibility: 'worldwide',
        eligibilityLabel: 'Open Worldwide',
        tags: (h.themes || []).map(t => t.name).slice(0, 2)
      };
    });
  } catch (e) {
    console.error('Devpost error:', e.message);
    return [];
  }
}

async function fetchScholarshipsForAfricans() {
  try {
    const res = await fetch('https://scholarshipsforafricans.com/rss.xml', { headers: { 'User-Agent': GENERIC_UA } });
    if (!res.ok) throw new Error(`SFA: ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    console.log(`ScholarshipsForAfricans: fetched ${items.length}`);

    return items.map(item => {
      const title = extractXmlTag(item, 'title');
      const description = extractXmlTag(item, 'description');
      const link = extractXmlTag(item, 'link');
      const categories = [];
      const catMatches = item.match(/<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/g) || [];
      catMatches.forEach(m => {
        const cat = extractXmlTag(m, 'category');
        if (cat) categories.push(cat);
      });

      const combined = `${title} ${description}`.toLowerCase();
      let elig = { code: 'africa', label: 'Open to Africa' };

      if (matchAny(combined, NIGERIA_KEYWORDS)) {
        elig = { code: 'nigeria', label: 'Open to Nigeria' };
      } else if (matchAny(combined, ['open to all nationalities', 'international students', 'worldwide', 'any nationality'])) {
        elig = { code: 'worldwide', label: 'Open Worldwide' };
      }

      return {
        type: 'scholarship',
        source: 'scholarshipsforafricans',
        id: `sfa-${slugify(title)}`,
        title,
        company: 'N/A',
        url: link,
        datePosted: null,
        firstSeenAt: new Date().toISOString(),
        expiresAt: null,
        eligibility: elig.code,
        eligibilityLabel: elig.label,
        tags: categories.slice(0, 2)
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('ScholarshipsForAfricans error:', e.message);
    return [];
  }
}

function normalizeKey(item) {
  return normalizeUrl(item.url);
}

function secondaryKey(item) {
  return `${item.type}|${slugify(item.title)}|${slugify(item.company)}`;
}

function mergeItems(existing, newItem) {
  return {
    ...newItem,
    firstSeenAt: existing.firstSeenAt
  };
}

function shouldPrune(item, now) {
  if (item.expiresAt) {
    try {
      if (new Date(item.expiresAt) < now) return true;
    } catch {}
  }

  if (item.type === 'scholarship') {
    try {
      if (new Date(item.firstSeenAt) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return true;
    } catch {}
  } else {
    if (item.datePosted) {
      try {
        if (new Date(item.datePosted) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return true;
      } catch {}
    } else {
      try {
        if (new Date(item.firstSeenAt) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return true;
      } catch {}
    }
  }

  return false;
}

async function main() {
  try {
    let existing = { generatedAt: null, items: [] };
    if (fs.existsSync(dataFile)) {
      try {
        existing = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      } catch (e) {
        console.warn('Could not parse existing data, starting fresh');
      }
    }

    const existingByKey = new Map();
    existing.items?.forEach(item => {
      const pk = normalizeKey(item);
      const sk = secondaryKey(item);
      if (pk) existingByKey.set(pk, item);
      if (sk) existingByKey.set(sk, item);
    });

    console.log('\n=== Fetching opportunities ===');
    const [remoteOK, wwr, himalayas, arbeitnow, devpost, scholarships] = await Promise.all([
      fetchRemoteOK(),
      fetchWeWorkRemotely(),
      fetchHimalayas(),
      fetchArbeitnow(),
      fetchDevpost(),
      fetchScholarshipsForAfricans()
    ]);

    const allNew = [...remoteOK, ...wwr, ...himalayas, ...arbeitnow, ...devpost, ...scholarships];
    const sourceOrder = { himalayas: 1, weworkremotely: 2, arbeitnow: 3, remoteok: 4, devpost: 5, scholarshipsforafricans: 6 };
    const merged = new Map();

    allNew.forEach(item => {
      const pk = normalizeKey(item);
      const sk = secondaryKey(item);
      const key = pk || sk;

      if (!key) return;

      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, item);
      } else {
        const newOrder = sourceOrder[item.source] || 99;
        const existOrder = sourceOrder[existing.source] || 99;
        if (newOrder < existOrder) {
          merged.set(key, item);
        }
      }
    });

    let items = Array.from(merged.values());
    console.log(`\nAfter dedup: ${items.length} items`);

    const now = new Date();
    const before = items.length;
    items = items.filter(item => !shouldPrune(item, now));
    console.log(`After pruning (>30d old): ${items.length} items (removed ${before - items.length})`);

    items.sort((a, b) => {
      const dateA = a.datePosted || a.firstSeenAt;
      const dateB = b.datePosted || b.firstSeenAt;
      return new Date(dateB) - new Date(dateA);
    });

    const output = {
      generatedAt: new Date().toISOString(),
      items
    };

    fs.writeFileSync(dataFile, JSON.stringify(output, null, 2));
    console.log(`\nWrote ${items.length} opportunities to ${dataFile}`);

    const typeCounts = {};
    items.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    console.log('Breakdown:', typeCounts);
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
}

main();
