// Pins on the "Campus to India" map. Facts only: add a row when the club supplies a verified city, e.g. { city, lat, lon, colleges }.
// Warangal's coordinates (17.98 N, 79.53 E) are public geography. Nothing else is invented: no cities, college counts or participants.
export type Reach = { city: string; lat: number; lon: number; colleges?: number };
export const home: Reach = { city: "Warangal", lat: 17.98, lon: 79.53 };
export const reach: Reach[] = [];
