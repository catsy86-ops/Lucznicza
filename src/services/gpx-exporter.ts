/**
 * GPX Exporter Service
 * Generates standard GPX 1.1 XML for walking/cycling routes compatible with
 * Garmin, Strava, Komoot, and Apple/Google health ecosystems.
 */
import type { WalkingRoute } from '../types';

export class GpxExporterService {
  /**
   * Generates a well-formed GPX 1.1 XML string from a WalkingRoute
   */
  generateGpx(route: WalkingRoute): string {
    const creator = 'Niebuszewo-Lucznicza-Guide';
    const time = new Date().toISOString();
    const safeName = this.escapeXml(route.name);
    const safeDesc = this.escapeXml(route.desc || 'Trasa wygenerowana przez Przewodnik po Łuczniczej i Niebuszewie');

    // Waypoints from stops if present
    const waypointsXml = (route.stops || []).map((stop, idx) => {
      // If coordinates are in route.coords
      const coord = route.coords && route.coords[idx];
      if (!coord) return '';
      // GeoJSON format is [lng, lat]
      const lon = coord[0];
      const lat = coord[1];
      return `  <wpt lat="${lat}" lon="${lon}">
    <name>${this.escapeXml(stop.name)}</name>
    <desc>${this.escapeXml(stop.addr || '')}</desc>
    <sym>Waypoint</sym>
  </wpt>`;
    }).filter(Boolean).join('\n');

    // Track points
    const trackPointsXml = (route.coords || []).map(coord => {
      const lon = coord[0];
      const lat = coord[1];
      return `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="${creator}" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${safeName}</name>
    <desc>${safeDesc}</desc>
    <time>${time}</time>
  </metadata>
${waypointsXml}
  <trk>
    <name>${safeName}</name>
    <type>${this.escapeXml(route.type || 'walking')}</type>
    <trkseg>
${trackPointsXml}
    </trkseg>
  </trk>
</gpx>`;
  }

  /**
   * Triggers client-side browser download of the GPX file
   */
  downloadGpx(route: WalkingRoute): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    try {
      const gpxContent = this.generateGpx(route);
      const blob = new Blob([gpxContent], { type: 'application/gpx+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename = `trasa_${route.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.gpx`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('[GpxExporter] Failed to trigger download:', e);
      return false;
    }
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

export const gpxExporter = new GpxExporterService();
