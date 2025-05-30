/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.selffindinglab.co.kr',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    // 수동 경로 추가
    additionalPaths: async (config) => [
        { loc: '/' },
        { loc: '/intro' },
        { loc: '/books' },
        { loc: '/news' },
        { loc: '/projects' },
    ],
};
