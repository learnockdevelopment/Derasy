// components/SearchBox.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

export default function SearchBox({ onSelect }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      showMarker: true,
      showPopup: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'ابحث هنا...',
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (e) => {
      const { location } = e;
      if (onSelect) {
        onSelect({ lat: location.y, lng: location.x });
      }
    });

    return () => map.removeControl(searchControl);
  }, [map, onSelect]);

  return null;
}
