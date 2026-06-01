/**
 * map-ratings-heatmap.js — Ratings heatmap visualization
 * Shows highly-rated vs poorly-rated areas, zone aggregation
 */
'use strict';

const MapRatingsHeatmap = (() => {
  const cfg = {
    enabled: false,
    layer: null,
    opacity: 0.6,
    showDetails: true
  };

  function init(map) {
    cfg.map = map;
    console.log('⭐ Inicjalizacja heatmapy ocen...');
  }

  function toggle() {
    if (cfg.enabled) {
      disable();
    } else {
      enable();
    }
  }

  function enable() {
    const map = cfg.map;
    if (!map) return;

    cfg.enabled = true;
    drawRatingsHeatmap();
    showToast('⭐ Heatmapa ocen włączona');
  }

  function disable() {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    map.removeLayer(cfg.layer);
    cfg.layer = null;
    cfg.enabled = false;
    showToast('⭐ Heatmapa ocen wyłączona');
  }

  function drawRatingsHeatmap() {
    const map = cfg.map;
    const group = L.layerGroup();

    if (!APP_DATA || !APP_DATA.places) {
      showToast('⚠️ Brak danych miejsc');
      return;
    }

    // Group places by proximity to create zones
    const zones = createRatingZones(APP_DATA.places);

    zones.forEach(zone => {
      const avgRating = zone.avgRating;
      const color = getRatingColor(avgRating);
      const intensity = avgRating / 5; // Normalize 0-1

      // Draw zone circle
      const circle = L.circle(zone.center, {
        radius: zone.radius,
        color: color,
        weight: 2,
        opacity: 0.7,
        fillColor: color,
        fillOpacity: cfg.opacity * intensity,
        interactive: true
      });

      // Popup with details
      const popupContent = `
        <div class="ratings-zone-popup">
          <div class="rzp-header">
            <strong>Strefa ocen</strong>
          </div>
          <div class="rzp-body">
            <div class="rzp-rating">
              <span class="rzp-stars">${'⭐'.repeat(Math.round(avgRating))}</span>
              <span class="rzp-score">${avgRating.toFixed(1)}/5.0</span>
            </div>
            <div class="rzp-stats">
              <div>📍 Miejsc: ${zone.places.length}</div>
              <div>👥 Ocen: ${zone.totalReviews}</div>
              <div>📊 Średnia: ${zone.places.map(p => p.rating || 0).reduce((a, b) => a + b, 0).toFixed(1)}</div>
            </div>
            <div class="rzp-places">
              <strong>Miejsca:</strong>
              <ul style="font-size:11px; margin:4px 0; padding-left:16px">
                ${zone.places.slice(0, 3).map(p => `
                  <li>${p.emoji} ${p.name} <strong>${p.rating || '?'}</strong></li>
                `).join('')}
                ${zone.places.length > 3 ? `<li>... i ${zone.places.length - 3} więcej</li>` : ''}
              </ul>
            </div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'ratings-popup-wrapper'
      });

      // Add zone label
      const emoji = zone.avgRating >= 4.5 ? '🌟' : zone.avgRating >= 4 ? '⭐' : zone.avgRating >= 3 ? '👍' : '📍';
      const label = L.marker(zone.center, {
        icon: L.divIcon({
          html: `<div class="rating-zone-label"><span>${emoji}</span><span>${zone.avgRating.toFixed(1)}</span></div>`,
          className: 'rating-zone-marker',
          iconSize: null
        })
      });

      group.addLayer(circle);
      group.addLayer(label);
    });

    // Add legend
    addLegend(group);

    group.addTo(map);
    cfg.layer = group;
  }

  function createRatingZones(places) {
    // Simple zone creation based on place clusters
    const zoneSize = 5; // Number of places per zone
    const zones = [];

    // Group by categories and proximity
    const categories = {};
    places.forEach(place => {
      if (!categories[place.cat]) {
        categories[place.cat] = [];
      }
      categories[place.cat].push(place);
    });

    // Create zones per category
    Object.values(categories).forEach(catPlaces => {
      for (let i = 0; i < catPlaces.length; i += zoneSize) {
        const zoneePlaces = catPlaces.slice(i, i + zoneSize);
        const centerLat = zoneePlaces.reduce((sum, p) => sum + p.coords[1], 0) / zoneePlaces.length;
        const centerLng = zoneePlaces.reduce((sum, p) => sum + p.coords[0], 0) / zoneePlaces.length;

        // Calculate average rating
        const ratings = zoneePlaces.map(p => p.rating || 0).filter(r => r > 0);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 3;
        const totalReviews = zoneePlaces.reduce((sum, p) => sum + (p.reviewCount || 0), 0);

        // Calculate radius based on spread
        let maxDist = 0;
        zoneePlaces.forEach(p => {
          const dist = Math.sqrt(
            Math.pow(p.coords[1] - centerLat, 2) + Math.pow(p.coords[0] - centerLng, 2)
          );
          if (dist > maxDist) maxDist = dist;
        });
        const radius = Math.max(150, maxDist * 111000); // Convert to meters

        zones.push({
          center: [centerLat, centerLng],
          radius: radius,
          places: zoneePlaces,
          avgRating: avgRating,
          totalReviews: totalReviews
        });
      }
    });

    return zones;
  }

  function getRatingColor(rating) {
    if (rating >= 4.5) return '#4ade80'; // Green - Excellent
    if (rating >= 4.0) return '#84cc16'; // Light green - Very good
    if (rating >= 3.5) return '#fbbf24'; // Yellow - Good
    if (rating >= 3.0) return '#f97316'; // Orange - Average
    if (rating >= 2.0) return '#f87171'; // Light red - Poor
    return '#dc2626'; // Red - Very poor
  }

  function addLegend(group) {
    const legendItems = [
      { rating: 4.5, color: '#4ade80', text: 'Doskonałe 4.5+' },
      { rating: 4.0, color: '#84cc16', text: 'Bardzo dobre 4.0+' },
      { rating: 3.5, color: '#fbbf24', text: 'Dobre 3.5+' },
      { rating: 3.0, color: '#f97316', text: 'Średnie 3.0+' },
      { rating: 2.0, color: '#f87171', text: 'Słabe 2.0+' },
      { rating: 1.0, color: '#dc2626', text: 'Bardzo słabe' }
    ];

    // Legend will be shown in map info panel
    window.ratingsLegend = legendItems;
  }

  function getHighestRatedZone() {
    if (!cfg.layer) return null;

    let highest = null;
    let maxRating = 0;

    cfg.layer.eachLayer(layer => {
      if (layer.placeData && layer.placeData.rating > maxRating) {
        maxRating = layer.placeData.rating;
        highest = layer;
      }
    });

    return highest;
  }

  function filterByRating(minRating, maxRating = 5) {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    cfg.layer.eachLayer(layer => {
      if (layer.placeData) {
        const rating = layer.placeData.rating || 0;
        const visible = rating >= minRating && rating <= maxRating;
        layer.setStyle({ opacity: visible ? 0.7 : 0.1 });
      }
    });

    showToast(`⭐ Filtr: oceny ${minRating.toFixed(1)} - ${maxRating.toFixed(1)}`);
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    filterByRating,
    getHighestRatedZone,
    getRatingColor
  };
})();

window.MapRatingsHeatmap = MapRatingsHeatmap;
