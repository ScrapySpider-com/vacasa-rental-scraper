import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import { createRouter } from './routes.js';

await Actor.init();

const input = await Actor.getInput() ?? {};

const {
    startUrls = [],
    googleMapsApiKey,
    proxyConfiguration: proxyConfig,
} = input;

if (!startUrls.length) {
    throw new Error('At least one Vacasa unit URL is required in startUrls.');
}

const proxyConfiguration = proxyConfig
    ? await Actor.createProxyConfiguration(proxyConfig)
    : undefined;

const router = createRouter({ googleMapsApiKey });

const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestHandler: router,
    requestHandlerTimeoutSecs: 120,
    launchContext: {
        launchOptions: {
            args: ['--disable-gpu', '--no-sandbox'],
        },
    },
});

await crawler.run(
    startUrls.map((startUrl) => ({
        url: startUrl,
        label: startUrl.includes('/unit/') ? 'detail' : 'start',
    })),
);

await Actor.exit();
