const fs = require('fs');
const data = JSON.parse(fs.readFileSync('content/blog/blog-articles.json', 'utf8'));
let articles = data.articles;

// 1. Filter out any entries with missing/undefined slugs (corrupt entries)
const beforeCount = articles.length;
articles = articles.filter(a => a && a.slug);
console.log('Filtered out', beforeCount - articles.length, 'entries with missing slugs');

// 2. Deduplicate by slug (keep first occurrence)
const seenSlugs = new Set();
const deduped = [];
articles.forEach(a => {
    if (!seenSlugs.has(a.slug)) {
        seenSlugs.add(a.slug);
        deduped.push(a);
    }
});
if (deduped.length < articles.length) {
    console.log('Deduplicated', articles.length - deduped.length, 'duplicate slugs');
}
articles = deduped;

// 3. Sort by slug alphabetically for deterministic ordering
articles.sort((a, b) => a.slug.localeCompare(b.slug));

// 4. Renumber sequentially 1..N
articles.forEach((a, i) => { a.id = i + 1; });
console.log('After cleanup:', articles.length, 'unique articles, IDs 1..' + articles.length);

// 5. Add the 5 missing articles (V×2 + W×3) that are on disk but not in JSON
const toAdd = [
    {
        slug: 'uk-ltd-video-production-photography-business-2026',
        title: 'UK LTD for Video Production & Photography Business: Start a Video Production Company, Filmmaking Business, Photography Studio, Commercial Photography, Event Videography, or Content Creation Company in 2026',
        metaTitle: 'UK LTD for Video Production & Photography Business 2026 | Video Production, Filmmaking, Photography Studio UK',
        metaDescription: 'Complete 2026 guide for video production and photography businesses forming a UK LTD. Covers video production companies, filmmaking, photography studios, commercial photography, event videography, content creation, YouTube/social media content, equipment and insurance, VAT on creative services, intellectual property rights, copyright, client agreements.',
        category: 'Business by Industry',
        tags: ['video production','photography','filmmaking','content creation','commercial photography','event videography','YouTube','social media content','VAT creative services','intellectual property','copyright','equipment insurance','non-resident entrepreneur','UK LTD'],
        focusKeyword: 'UK LTD video production photography business',
        excerpt: 'Complete 2026 guide for video production and photography businesses forming a UK LTD. Covers video production companies, filmmaking, photography studios, commercial photography, event videography, content creation, YouTube/social media content, equipment and insurance, VAT on creative services, intellectual property rights, copyright, client agreements.',
        image: '/images/blog/uk-ltd-video-production-photography.jpg',
        imageAlt: 'Video production and photography camera equipment with UK LTD creative business branding',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 13
    },
    {
        slug: 'uk-ltd-volunteering-community-services-business-2026',
        title: 'UK LTD for Volunteering & Community Services Business: Start a Community Organisation, Charity Support Service, Social Enterprise, Volunteer Coordination Service, Community Development Company, Non-Profit Support Business, or CSR Initiative in 2026',
        metaTitle: 'UK LTD for Volunteering & Community Services Business 2026 | Community Organisations, Social Enterprises, Charity Support UK',
        metaDescription: 'Complete 2026 guide for volunteering and community services businesses forming a UK LTD. Covers community organisations, charity support services, social enterprises, volunteer coordination, community development, non-profit support, CSR initiatives, grant funding, community partnerships, and non-resident social entrepreneurs from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond.',
        category: 'Business by Industry',
        tags: ['volunteering','community services','social enterprise','charity support','community organisation','volunteer coordination','community development','non-profit','CSR','grant funding','community partnerships','non-resident entrepreneur','UK LTD'],
        focusKeyword: 'UK LTD volunteering community services business',
        excerpt: 'Complete 2026 guide for volunteering and community services businesses forming a UK LTD. Covers community organisations, charity support services, social enterprises, volunteer coordination, community development, non-profit support, CSR initiatives, grant funding, community partnerships, and non-resident social entrepreneurs from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond.',
        image: '/images/blog/uk-ltd-volunteering-community-services.jpg',
        imageAlt: 'Community volunteers and social enterprise team with UK LTD community services branding',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 12
    },
    {
        slug: 'uk-ltd-waste-management-recycling-business-2026',
        title: 'UK LTD for Waste Management & Recycling Business: Start a Waste Collection Company, Recycling Centre, Waste Transfer Station, Skip Hire Business, Waste Brokerage, Composting Operation, or Circular Economy Business in 2026',
        metaTitle: 'UK LTD for Waste Management & Recycling Business 2026 | Waste Collection, Recycling Centre, Skip Hire UK',
        metaDescription: 'Complete 2026 guide for waste management and recycling businesses forming a UK LTD. Covers waste collection, recycling centres, waste transfer stations, skip hire, waste brokerage, composting, hazardous waste, waste permits and licensing (Environment Agency, SEPA, NRW, NIEA), waste carrier registration, environmental permits, duty of care, waste regulations, VAT on waste services, insurance.',
        category: 'Business by Industry',
        tags: ['waste management','recycling business','waste collection','waste transfer station','skip hire','waste brokerage','composting','hazardous waste','waste permits','Environment Agency','waste carrier','duty of care','circular economy','environmental permits','non-resident entrepreneur','UK LTD'],
        focusKeyword: 'UK LTD waste management recycling business',
        excerpt: 'Complete 2026 guide for waste management and recycling businesses forming a UK LTD. Covers waste collection, recycling centres, waste transfer stations, skip hire, waste brokerage, composting, hazardous waste, waste permits and licensing (Environment Agency, SEPA, NRW, NIEA), waste carrier registration, environmental permits, duty of care, waste regulations, VAT on waste services, insurance.',
        image: '/images/blog/uk-ltd-waste-management-recycling.jpg',
        imageAlt: 'Waste management and recycling facility with UK LTD waste management company branding',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 17
    },
    {
        slug: 'uk-ltd-food-beverage-restaurant-business-2026',
        title: 'UK LTD for Food, Beverage & Restaurant Business: Start a Restaurant, Cafe, Bar, Pub, Food Truck, Catering Business, Mobile Food Service, Cloud Kitchen, Brewery, Distillery, Coffee Shop, or Food & Beverage Company in 2026',
        metaTitle: 'UK LTD for Food, Beverage & Restaurant Business 2026 | Restaurants, Cafes, Bars, Pubs, Food Trucks, Catering UK',
        metaDescription: 'Complete 2026 guide for food, beverage and restaurant businesses forming a UK LTD. Covers restaurants, cafes, bars, pubs, food trucks, catering, mobile food, cloud kitchens, breweries, distilleries, coffee shops, food hygiene, food business registration, alcohol licensing, planning, VAT on food and drink, business rates, employment, insurance.',
        category: 'Business by Industry',
        tags: ['food business','beverage business','restaurant','cafe','bar','pub','food truck','catering','mobile food','cloud kitchen','brewery','distillery','coffee shop','food hygiene','food business registration','alcohol licensing','VAT food','non-resident entrepreneur','UK LTD'],
        focusKeyword: 'UK LTD food beverage restaurant business',
        excerpt: 'Complete 2026 guide for food, beverage and restaurant businesses forming a UK LTD. Covers restaurants, cafes, bars, pubs, food trucks, catering, mobile food, cloud kitchens, breweries, distilleries, coffee shops, food hygiene, food business registration, alcohol licensing, planning, VAT on food and drink, business rates, employment, insurance.',
        image: '/images/blog/uk-ltd-food-beverage-restaurant.jpg',
        imageAlt: 'Restaurant cafe bar food and beverage business with UK LTD food business branding',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 16
    },
    {
        slug: 'uk-ltd-wedding-planning-event-design-business-2026',
        title: 'UK LTD for Wedding Planning & Event Design Business: Start a Wedding Planner, Event Designer, Bridal Styling, Wedding Coordination, Luxury Wedding Services, or Full-Service Event Planning Company in 2026',
        metaTitle: 'UK LTD for Wedding Planning & Event Design Business 2026 | Wedding Planners, Event Designers, Bridal Styling UK',
        metaDescription: 'Complete 2026 guide for wedding planning and event design businesses forming a UK LTD. Covers wedding planners, event designers, bridal styling, wedding coordination, luxury wedding services, full-service event planning, venue sourcing, supplier networks (caterers, florists, photographers, musicians), wedding insurance, VAT on wedding services, client contracts and deposits, destination weddings, travel for wedding planners.',
        category: 'Business by Industry',
        tags: ['wedding planning','event design','wedding planner','event designer','bridal styling','wedding coordination','luxury wedding','event planning','venue sourcing','supplier network','wedding insurance','VAT wedding services','client contracts','destination weddings','non-resident entrepreneur','UK LTD'],
        focusKeyword: 'UK LTD wedding planning event design business',
        excerpt: 'Complete 2026 guide for wedding planning and event design businesses forming a UK LTD. Covers wedding planners, event designers, bridal styling, wedding coordination, luxury wedding services, full-service event planning, venue sourcing, supplier networks (caterers, florists, photographers, musicians), wedding insurance, VAT on wedding services, client contracts and deposits, destination weddings, travel for wedding planners.',
        image: '/images/blog/uk-ltd-wedding-planning-event-design.jpg',
        imageAlt: 'Wedding ceremony and event design with UK LTD wedding planning and event design business branding',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 14
    }
];

let added = 0;
toAdd.forEach(article => {
    if (!articles.find(a => a.slug === article.slug)) {
        articles.push(article);
        added++;
        console.log('Added:', article.slug);
    } else {
        console.log('Already present:', article.slug);
    }
});

// 6. Final sort by ID and write
articles.sort((a, b) => a.id - b.id);
articles.forEach((a, i) => { a.id = i + 1; });

fs.writeFileSync('content/blog/blog-articles.json', JSON.stringify({articles: articles}, null, 2));

console.log('');
console.log('=== FINAL STATE ===');
console.log('Total articles:', articles.length);
console.log('IDs: sequential 1..' + articles.length);
console.log('Files on disk (5 articles):', added, 'added to JSON');
console.log('');
console.log('New articles (last 5):');
for (let i = articles.length - 5; i < articles.length; i++) {
    console.log('  ID ' + (i+1) + ': ' + articles[i].slug);
}
