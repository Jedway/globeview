import type { GeoFeature } from '../types/geo';

export async function loadWorldMap(): Promise<GeoFeature[]> {
  const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson');
  const data = await response.json();
  return data.features;
}