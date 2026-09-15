const fs = require('fs');
const data = JSON.parse(fs.readFileSync('content/blog/blog-articles.json', 'utf8'));
const articles = data.articles;
const maxId = Math.max(...articles.map(a => a.id));
let nextId = maxId + 1;

function addArticle(slug, articleData) {
    const existing = articles.find(a => a.slug === slug);
    if (existing) {
        console.log('SKIP:', slug, 'already ID', existing.id);
        return existing.id;
    }
    articleData.id = nextId++;
    articles.push(articleData);
    console.log('Added:', slug, '-> ID', articleData.id);
    return articleData.id;
}

addArticle('uk-ltd-video-production-photography-business-2026', {
    title: "UK LTD for Video Production & Photography Business: Start a Video Production Company, Filmmaking Business, Photography Studio, Commercial Photography, Event Videography, or Content Creation Company in 2026",
    metaTitle: "UK LTD for Video Production & Photography Business 2026 | Video Production, Filmmaking, Photography Studio UK",
    metaDescription: "Complete 2026 guide for video production and photography businesses forming a UK LTD. Covers video production companies, filmmaking, photography studios, commercial photography, event videography, content creation, YouTube/social media content, equipment and insurance, VAT on creative services, intellectual property rights, copyright, client agreements, and how non-resident creatives from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond can start a UK video production & photography LTD.",
    category: "Business by Industry",
    tags: ["video production","photography","filmmaking","content creation","commercial photography","event videography","YouTube","social media content","VAT creative services","intellectual property","copyright","equipment insurance","non-resident entrepreneur","UK LTD"],
    focusKeyword: "UK LTD video production photography business",
    excerpt: "Complete 2026 guide for video production and photography businesses forming a UK LTD. Covers video production companies, filmmaking, photography studios, commercial photography, event videography, content creation, YouTube/social media content, equipment and insurance, VAT on creative services, intellectual property rights, copyright, client agreements, and how non-resident creatives from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond can start a UK video production & photography LTD.",
    image: "/images/blog/uk-ltd-video-production-photography.jpg",
    imageAlt: "Video production and photography camera equipment with UK LTD creative business branding",
    publishedDate: "2026-09-14",
    updatedDate: "2026-09-14",
    readTime: 13
});

addArticle('uk-ltd-volunteering-community-services-business-2026', {
    title: "UK LTD for Volunteering & Community Services Business: Start a Community Organisation, Charity Support Service, Social Enterprise, Volunteer Coordination Service, Community Development Company, Non-Profit Support Business, or CSR Initiative in 2026",
    metaTitle: "UK LTD for Volunteering & Community Services Business 2026 | Community Organisations, Social Enterprises, Charity Support UK",
    metaDescription: "Complete 2026 guide for volunteering and community services businesses forming a UK LTD. Covers community organisations, charity support services, social enterprises, volunteer coordination, community development, non-profit support, CSR initiatives, grant funding, community partnerships, and how non-resident social entrepreneurs from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond can start a UK community services LTD.",
    category: "Business by Industry",
    tags: ["volunteering","community services","social enterprise","charity support","community organisation","volunteer coordination","community development","non-profit","CSR","grant funding","community partnerships","non-resident entrepreneur","UK LTD"],
    focusKeyword: "UK LTD volunteering community services business",
    excerpt: "Complete 2026 guide for volunteering and community services businesses forming a UK LTD. Covers community organisations, charity support services, social enterprises, volunteer coordination, community development, non-profit support, CSR initiatives, grant funding, community partnerships, and how non-resident social entrepreneurs from Pakistan, India, Bangladesh, Nigeria, UAE, Turkey, China and beyond can start a UK community services LTD.",
    image: "/images/blog/uk-ltd-volunteering-community-services.jpg",
    imageAlt: "Community volunteers and social enterprise team with UK LTD community services branding",
    publishedDate: "2026-09-14",
    updatedDate: "2026-09-14",
    readTime: 12
});

articles.sort((a, b) => a.id - b.id);
fs.writeFileSync('content/blog/blog-articles.json', JSON.stringify({articles: articles}, null, 2));
console.log('Total articles now:', articles.length);
console.log('Max ID:', Math.max(...articles.map(a => a.id)));
