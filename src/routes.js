import { createPuppeteerRouter, sleep } from 'crawlee';
import { Actor } from 'apify';

import { getAddressFromLatLong } from './helpers/google-maps.js';

export function createRouter({ googleMapsApiKey }) {
    const router = createPuppeteerRouter();

    router.addDefaultHandler(async ({ page, request, enqueueLinks, log }) => {
        log.info(`Processing listing page: ${request.loadedUrl}`);
        let nextButton;
        do {
            await page.waitForSelector('a.unit-listing-title');
            [nextButton] = await page.$$('ul > li:last-of-type > button.page-link:not([disabled])');
            await enqueueLinks({
                selector: 'a.unit-listing-title',
                label: 'detail',
                baseUrl: request.loadedUrl,
            });
            await sleep(5000);
            if (nextButton) await nextButton.click();
        } while (nextButton);
    });

    router.addHandler('detail', async ({ request, page, log }) => {
        log.info(`Scraping detail page: ${request.url}`);
        await page.waitForSelector('h1');

        let title = await page.$eval('h1', (el) => el.textContent.trim());
        title = title.replace(/\s+/g, ' ');

        let latitude = null;
        let longitude = null;

        await page.waitForSelector('img[class*=static-map]', { timeout: 30000 });

        const unitId = request.url?.split('unit/')?.[1]?.split('/')?.[0]?.split('?')?.[0];

        if (parseInt(unitId) > 0) {
            [latitude, longitude] = await page
                .evaluate(
                    (url) =>
                        fetch(window.location.origin + '/guest-com-api/get-locations', {
                            headers: {
                                accept: 'application/json, text/javascript, */*; q=0.01',
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'x-csrftoken': document.cookie.split('csrftoken=')[1]?.split(';')[0] || '',
                                'x-requested-with': 'XMLHttpRequest',
                            },
                            body:
                                '{"unit_ids":["' +
                                url?.split('unit/')?.[1]?.split('/')?.[0]?.split('?')?.[0] +
                                '"],"avail_start":null,"avail_end":null}',
                            method: 'POST',
                            credentials: 'include',
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data?.[0]?.lat && data?.[0]?.lng) return [data[0].lat, data[0].lng];
                                return [null, null];
                            }),
                    request.url,
                )
                .catch((error) => {
                    log.warning('Failed to fetch coordinates from Vacasa API', { error: error.message });
                    return [null, null];
                });
        }

        if (!latitude || !longitude) {
            log.warning(`Coordinates not found for ${request.url}, skipping.`);
            return;
        }

        const rating =
            (await page
                .evaluate(() => {
                    const score =
                        (document.querySelector('.review-score, .average-review-score')?.innerText &&
                            parseFloat(document.querySelector('.review-score, .average-review-score')?.innerText)) ||
                        0;
                    return (score && score * 2) || 'N/A';
                })
                .catch(() => 'N/A')) || 'N/A';

        const managedBy = 'Vacasa LLC';

        const result = {
            url: request.loadedUrl,
            title,
            latitude,
            longitude,
            rating,
            managedBy,
        };

        // Geocode if API key is provided
        if (googleMapsApiKey && latitude && longitude) {
            try {
                const addr = await getAddressFromLatLong(latitude, longitude, googleMapsApiKey);
                result.formattedAddress = addr.formatted_address;
                result.streetNumber = addr.street_number;
                result.route = addr.route;
                result.city = addr.city;
                result.state = addr.state;
                result.postalCode = addr.postal_code;
            } catch (error) {
                log.warning('Failed to geocode address', { error: error.message });
            }
        }

        log.info(`Scraped: ${title}`);
        await Actor.pushData(result);
    });

    return router;
}
