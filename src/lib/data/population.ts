export interface CountryPopulation {
  country: string;
  population: number;
}

export async function loadPopulationData(): Promise<Record<string, number>> {
  const response = await fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json');
  const data: CountryPopulation[] = await response.json();
  
  return data.reduce((acc, { country, population }) => {
    acc[country] = population;
    return acc;
  }, {} as Record<string, number>);
}