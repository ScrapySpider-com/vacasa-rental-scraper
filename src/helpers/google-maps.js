import fetch from 'node-fetch';

/**
 * Reverse geocodes lat/lng to a structured address using Google Maps API.
 * @param {number} lat
 * @param {number} lng
 * @param {string} apiKey - Google Maps Geocoding API key
 * @returns {object} Address object with formatted_address, street_number, route, city, state, postal_code
 */
export async function getAddressFromLatLong(lat, lng, apiKey) {
    if (!apiKey) throw new Error('Google Maps API key is required');

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
        const address = data.results[0];
        address.formatted_address = address?.formatted_address?.replace(/, USA$/, '')?.trim();
        address.street_number =
            address?.address_components?.find((c) => c.types.includes('street_number'))?.long_name || '';
        address.route =
            address?.address_components?.find((c) => c.types.includes('route'))?.long_name || '';
        address.city =
            address?.address_components?.find((c) => c.types.includes('locality'))?.long_name || '';
        address.state =
            address?.address_components?.find((c) => c.types.includes('administrative_area_level_1'))?.short_name || '';
        address.postal_code =
            address?.address_components?.find((c) => c.types.includes('postal_code'))?.long_name || '';
        return address;
    } else {
        throw new Error(`Geocoding error: ${data.status}`);
    }
}
