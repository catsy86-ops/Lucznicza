export type POICategory = 'sport' | 'food' | 'shop' | 'park' | 'service' | 'edu';

export interface PlacePOI {
  id: string | number;
  name: string;
  title?: string | undefined;
  cat: POICategory;
  coords: [number, number];
  desc: string;
  addr: string;
  address?: string | undefined;
  emoji?: string | undefined;
  hours?: string | null | undefined;
  phone?: string | null | undefined;
  website?: string | null | undefined;
  rating?: number | undefined;
  highlight?: boolean | undefined;
  tags?: string[] | undefined;
  photos?: string[] | undefined;
}

export interface RouteStop {
  name: string;
  title?: string | undefined;
  addr?: string | undefined;
  emoji?: string | undefined;
  coords?: [number, number] | undefined;
  desc?: string | undefined;
}

export interface WalkingRoute {
  id: number;
  name: string;
  title?: string | undefined;
  emoji?: string | undefined;
  type?: string | undefined;
  color: string;
  distance: string;
  distanceNum?: number | undefined;
  time: string;
  duration?: string | undefined;
  timeMin?: number | undefined;
  difficulty: 'Łatwa' | 'Średnia' | 'Wymagająca' | string;
  difficultyLevel?: number | undefined;
  calories?: number | undefined;
  terrain?: string | undefined;
  bestTime?: string | undefined;
  tags?: string[] | undefined;
  desc: string;
  highlights?: string[] | undefined;
  stops: RouteStop[];
  coords: [number, number][];
  path?: [number, number][] | undefined;
}

export interface CommunityEvent {
  day: string;
  month: string;
  name: string;
  place: string;
  desc: string;
  tag: string;
  source?: string | undefined;
}

export interface AppDataModel {
  center: [number, number];
  places: PlacePOI[];
  routes: WalkingRoute[];
  events: CommunityEvent[];
}

export interface RealtimeDeparture {
  line: string;
  direction: string;
  timeText: string;
  minutes: number;
  isLive: boolean;
  isSimulated?: boolean | undefined;
  type: 'tram' | 'bus';
  stop?: string | undefined;
  color?: string | undefined;
}

export interface ZditmStop {
  number: string;
  name: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
}

export interface ZditmVehicle {
  id: string;
  line: string;
  type: 'tram' | 'bus';
  lineType: string;
  direction: string;
  nextStop: string;
  previousStop: string;
  lat: number;
  lon: number;
  bearing?: number | undefined;
  velocity: number;
  punctuality: number;
  model: string;
  lowFloor: boolean;
  stuck: boolean;
  operator?: string | undefined;
}

export interface WeatherData {
  temp: number;
  apparentTemp: number;
  weatherCode: number;
  weatherDesc: string;
  weatherIcon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  updatedAt: string;
}

export interface AirQualityData {
  aqi: number;
  aqiLevel: 'Bardzo dobra' | 'Dobra' | 'Umiarkowana' | 'Dostateczna' | 'Zła' | 'Bardzo zła';
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  advice: string;
}

export interface AppState {
  currentSection: 'map' | 'places' | 'routes' | 'info' | 'transport' | 'events' | 'community' | 'pogon';
  currentCategory: POICategory | 'all';
  isDark: boolean;
  searchQuery: string;
  selectedPlaceId: string | null;
  activeRouteId: number | null;
  favorites: string[];
  departures?: RealtimeDeparture[] | undefined;
  vehicles?: ZditmVehicle[] | undefined;
  isDeparturesLoading?: boolean | undefined;
  connectionStatus?: 'online' | 'degraded' | 'offline' | undefined;
}