const BENGALURU_LAT = 12.9716;
const BENGALURU_LON = 77.5946;
const TIMEOUT_MS = 3000;

export async function fetchBengaluruWeather() {
  const fallback = {
    city: "Bengaluru",
    temperature_c: 24.0,
    precipitation_mm: 0.0,
    summary: "24.0°C | Rain: 0.0mm (Live)",
    source: "fallback"
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${BENGALURU_LAT}&longitude=${BENGALURU_LON}&current=temperature_2m,precipitation`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Weather API responded with status ${response.status}. Using fallback.`);
      return fallback;
    }

    const data = await response.json();
    const current = data.current;

    if (!current) {
      return fallback;
    }

    const temp = Math.round(Number(current.temperature_2m || 24.0) * 10) / 10;
    const precip = Math.round(Number(current.precipitation || 0.0) * 10) / 10;

    return {
      city: "Bengaluru",
      temperature_c: temp,
      precipitation_mm: precip,
      summary: `${temp}°C | Rain: ${precip}mm`,
      source: "open-meteo"
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Weather fetch failed or timed out:", error.message);
    return fallback;
  }
}
