const fs = require('fs');
const data = JSON.parse(fs.readFileSync('content/blog/blog-articles.json', 'utf8'));
const articles = data.articles;

const toAdd = [
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

const maxId = Math.max(...articles.map(a => a.id));
let nextId = maxId + 1;

toAdd.forEach(article => {
    const existing = articles.find(a => a.slug === article.slug);
    if (existing) {
        console.log('SKIP:', article.slug, 'already ID', existing.id);
    } else {
        article.id = nextId++;
        articles.push(article);
        console.log('Added:', article.slug, '-> ID', article.id);
    }
});

articles.sort((a, b) => a.id - b.id);
fs.writeFileSync('content/blog/blog-articles.json', JSON.stringify({articles: articles}, null, 2));
console.log('');
console.log('Total articles now:', articles.length);
console.log('Max ID:', Math.max(...articles.map(a => a.id)));
console.log('');
console.log('IDs 109-116:');
for (let i = 109; i <= 116; i++) {
    const found = articles.find(a => a.id === i);
    console.log('  ID ' + i + ':', found ? found.slug : 'MISSING');
}
