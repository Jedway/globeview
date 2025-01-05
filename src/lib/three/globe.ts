import * as THREE from 'three';
import type { GeoFeature } from '../types/geo';
import { GLOBE_RADIUS, GLOBE_SEGMENTS, COUNTRY_LINE_COLOR, GLOBE_COLOR, CONTINENT_COLORS } from './constants';
import { latLongToVector3 } from '../utils/coordinates';
import { COUNTRY_TO_CONTINENT } from '../data/continents';

export function createGlobe(scene: THREE.Scene): THREE.Group {
  const group = new THREE.Group();

  // Create the base sphere
  const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: GLOBE_COLOR,
    shininess: 15,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  group.add(sphere);

  scene.add(group);
  return group;
}

export function addCountryGeometry(group: THREE.Group, features: GeoFeature[]): void {
  features.forEach((feature) => {
    const countryName = feature.properties.name || feature.properties.ADMIN || feature.properties.NAME;
    const continent = COUNTRY_TO_CONTINENT[countryName] || 'Other';
    const color = CONTINENT_COLORS[continent] || GLOBE_COLOR;

    if (feature.geometry.type === 'Polygon') {
      addPolygon(group, feature.geometry.coordinates[0], color);
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach(polygon => {
        addPolygon(group, polygon[0], color);
      });
    }
  });
}

function addPolygon(group: THREE.Group, coordinates: number[][], color: number): void {
  const points: THREE.Vector3[] = [];
  coordinates.forEach(([long, lat]) => {
    points.push(latLongToVector3(lat, long));
  });

  // Create filled polygon
  const shape = new THREE.Shape();
  const geometry = new THREE.BufferGeometry();
  
  // Convert points to vertices
  const vertices = new Float32Array(points.length * 3);
  points.forEach((point, i) => {
    vertices[i * 3] = point.x;
    vertices[i * 3 + 1] = point.y;
    vertices[i * 3 + 2] = point.z;
  });
  
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  
  // Create and add the mesh
  const material = new THREE.MeshPhongMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  // Add country borders
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: COUNTRY_LINE_COLOR,
    transparent: true,
    opacity: 0.3,
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
}