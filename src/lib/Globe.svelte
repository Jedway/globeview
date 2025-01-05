<script lang="ts">
import { onMount } from 'svelte';
import type { ThreeContext } from './three/setup';
import { setupThreeScene, setupLights } from './three/setup';
import { createGlobe, addCountryGeometry } from './three/globe';
import { loadPopulationData } from './data/population';
import { loadWorldMap } from './data/worldMap';

let container: HTMLDivElement;
let threeContext: ThreeContext;
let hoveredCountry: string | null = null;
let populationData: Record<string, number> = {};
let resizeHandler: () => void;

function animate() {
  if (!threeContext) return;
  
  const { controls, renderer, scene, camera } = threeContext;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

onMount(async () => {
  const [worldMapData, popData] = await Promise.all([
    loadWorldMap(),
    loadPopulationData()
  ]);
  
  populationData = popData;
  
  threeContext = setupThreeScene(container);
  setupLights(threeContext.scene);
  
  const globeGroup = createGlobe(threeContext.scene);
  addCountryGeometry(globeGroup, worldMapData);
  
  // Setup resize handler
  resizeHandler = () => {
    const { camera, renderer } = threeContext;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', resizeHandler);
  
  animate();
  
  return () => {
    window.removeEventListener('resize', resizeHandler);
    threeContext.renderer.dispose();
    threeContext.controls.dispose();
  };
});
</script>

<div 
  bind:this={container} 
  class="globe-container"
>
  {#if hoveredCountry}
    <div class="tooltip">
      <h3>{hoveredCountry}</h3>
      <p>Population: {populationData[hoveredCountry]?.toLocaleString() || 'N/A'}</p>
    </div>
  {/if}
</div>

<style>
.globe-container {
  width: 100%;
  height: 100vh;
  background: #000;
  position: relative;
}

.tooltip {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 4px;
  pointer-events: none;
}

:global(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>