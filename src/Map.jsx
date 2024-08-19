import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import indiaGeoJson from './in.json'; // Import GeoJSON file

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error('Map container is null');
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [78.9629, 20.5937],
      zoom: 5,
    });

    map.on('load', () => {
      // Add GeoJSON data as a source
      map.addSource('india', {
        type: 'geojson',
        data: indiaGeoJson, // Use the imported GeoJSON data
      });

      // Add a layer to display India
      map.addLayer({
        id: 'india-layer',
        type: 'fill',
        source: 'india',
        paint: {
          'fill-color': '#FFA500', // Set the color for India
          'fill-opacity': 0.8,     // Set the opacity
        },
      });

      // Add a layer for state borders
      map.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'india',
        paint: {
          'line-color': '#000000', // Color of state borders
          'line-width': 1,         // Width of state borders
        },
        filter: ['==', '$type', 'Polygon'], // Use this filter to ensure only polygon features are selected
      });

      // Adjust existing background layer if present
      const backgroundLayer = map.getStyle().layers.find(layer => layer.type === 'background');
      if (backgroundLayer) {
        map.setPaintProperty('background', 'background-color', '#FFFFFF'); // Set the background color to white
      } else {
        // Add a new background layer if not present
        map.addLayer({
          id: 'background-layer',
          type: 'background',
          paint: {
            'background-color': '#FFFFFF', // Set the background color to white
          },
        });
      }

      // Hide all layers except the ones for India and state borders
      map.getStyle().layers.forEach(layer => {
        // Hide all fill layers except India
        if (layer.type === 'fill' && layer.id !== 'india-layer') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
        // Hide all line layers except state borders
        if (layer.type === 'line' && layer.id !== 'state-borders') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
        // Hide all symbol layers (labels)
        if (layer.type === 'symbol') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
        // Hide all fill-extrusion layers (3D polygons)
        if (layer.type === 'fill-extrusion') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    });

    map.on('click', (e) => {
      console.log('Map clicked at', e.lngLat);
    });

    return () => map.remove();
  }, [mapContainerRef]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '95vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        margin: 'auto',
      }}
    />
  );
};

export default Map;
