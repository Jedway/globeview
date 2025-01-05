<script lang="ts">
import Globe from './lib/Globe.svelte';
import Header from './lib/components/Header.svelte';
import Footer from './lib/components/Footer.svelte';
</script>

<div class="app">
  <Header />
  <main>
    <Globe />
  </main>
  <Footer />
</div>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1d2021; /* Gruvbox dark */
}

main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

:global(body) {
  margin: 0;
  font-family: 'Geist Mono', system-ui, -apple-system, sans-serif;
}

:global(@font-face) {
  font-family: 'Geist Mono';
  src: url('https://assets.vercel.com/raw/upload/v1697913431/fonts/geist-mono/GeistMono-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
</style>