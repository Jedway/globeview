import type { Feature, Geometry } from '@types/geojson';

export interface GeoFeature extends Feature<Geometry> {
  properties: {
    name: string;
    [key: string]: any;
  };
}

export interface WorldMapData {
  type: string;
  features: GeoFeature[];
}