import * as THREE from 'three';
import { GLOBE_RADIUS } from '../three/constants';

export function latLongToVector3(lat: number, long: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);

  const x = -(GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta));
  const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
  const y = GLOBE_RADIUS * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}