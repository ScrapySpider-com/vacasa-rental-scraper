## Vacasa Rental Scraper

Scrapes Vacasa vacation rental listings and extracts property details, GPS coordinates, guest ratings, and property manager info — no account or cookies required. Optionally geocodes coordinates into full street addresses via Google Maps.

- No Vacasa account or cookies needed
- Extracts property title, latitude, longitude, and guest rating
- Uses Vacasa's internal API for accurate GPS coordinates
- Optional Google Maps geocoding for full street addresses (street, city, state, ZIP)
- Handles listing pages with automatic pagination
- Outputs clean JSON ready for Google Sheets, CRMs, or data pipelines
- Free to use — you only pay for Apify platform credits

### What data does it extract?

Each result contains:

**Property info:** title, listing URL, guest rating (scaled to 10), property manager name

**Location (always included):** latitude, longitude

**Address (with Google Maps API key):** formatted address, street number, street name, city, state, postal/ZIP code

All results are available as JSON, CSV, or Excel via the Apify dataset export.

### Use cases

- **Vacation rental research:** Compile property data across Vacasa destinations for market analysis
- **Property management intelligence:** Identify Vacasa-managed properties in target markets with exact locations
- **Real estate analysis:** Geocode rental listings to compare pricing by neighborhood or ZIP code
- **Competitor monitoring:** Track Vacasa listings, ratings, and availability in specific regions
- **Lead generation:** Build lists of vacation rental properties with location data for outreach

### How to use

1. Click **Try for free** above
2. In the **Input** tab, paste one or more Vacasa unit URLs (e.g., `https://www.vacasa.com/unit/124365`)
3. Optionally add your **Google Maps API Key** to get full street addresses
4. Click **Start** and wait for the run to complete (typically under 1 minute per listing)
5. Download your results as JSON, CSV, or Excel from the **Output** tab

### Input parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `startUrls` | Array of strings | Yes | Vacasa unit URLs to scrape. Example: `https://www.vacasa.com/unit/124365` |
| `googleMapsApiKey` | String | No | Google Maps Geocoding API key. When provided, coordinates are reverse-geocoded into full addresses. |
| `proxyConfiguration` | Object | No | Proxy settings. Defaults to Apify Proxy. Recommended to leave as default. |

### Output example

```json
{
    "url": "https://www.vacasa.com/unit/124365",
    "title": "Mountain View Retreat | 3BR | Hot Tub & Fireplace",
    "latitude": 44.197702,
    "longitude": -72.885478,
    "rating": 9.2,
    "managedBy": "Vacasa LLC",
    "formattedAddress": "123 Mountain Rd, Stowe, VT 05672",
    "streetNumber": "123",
    "route": "Mountain Rd",
    "city": "Stowe",
    "state": "VT",
    "postalCode": "05672"
}
```

> **Note:** Address fields (`formattedAddress`, `streetNumber`, `route`, `city`, `state`, `postalCode`) are only included when a Google Maps API key is provided.

### Pricing

This Actor is **free to use** — you only pay for Apify platform compute time and proxy usage.
A typical run of 10 listings costs approximately $0.05–$0.10 in Apify platform credits.

New Apify accounts receive $5 in free credits — enough for hundreds of Vacasa listing scrapes.

### Technical notes

- **No account needed:** This Actor does not require a Vacasa login or cookies to operate
- **Coordinates:** GPS coordinates are fetched from Vacasa's internal `get-locations` API for high accuracy
- **Geocoding:** Providing a Google Maps Geocoding API key unlocks full address data; without it, only lat/long are returned
- **Proxies:** Apify Proxy is recommended for reliable access. Residential proxies may be needed for large runs
- **Rate limits:** For large batches (100+ listings), consider increasing Actor memory to 2–4 GB
- **Data freshness:** All data is scraped live — no cached or stale data

### Integrations

Outputs are compatible with:

- **Make (formerly Integromat):** Use the Apify module to trigger runs and send data to Google Sheets or Airtable
- **Zapier:** Connect Actor runs to 5,000+ apps via the Apify Zapier app
- **Google Sheets:** Export dataset directly as CSV and import
- **REST API:** Run the Actor programmatically and poll results via the Apify API

### Support

Have questions or found a bug? Reach out:

- **Email:** ScrapySpider@protonmail.com
- **Website:** [ScrapySpider.com](https://ScrapySpider.com)
- **Apify:** Open a support issue on this Actor page
- **Response time:** Within 24–48 hours on weekdays
