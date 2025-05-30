/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://www.selffindinglab.co.kr',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'daily',
    priority: 1,
    // admin, dashboard 경로 제외
    exclude: ['/admin*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin'], // robots.txt 차단
            },
        ],
    },
};
