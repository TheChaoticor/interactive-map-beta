import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import style from './style.json';

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

      // Add a layer to mask other countries
      map.addLayer({
        id: 'mask-layer',
        type: 'fill',
        paint: {
          'fill-color': 'rgba(128, 128, 128, 0.5)', // Grey with 50% opacity
          'fill-opacity': 1,
        },
      });

      // Add a filter to the mask layer to exclude India
      map.setFilter('mask-layer', ['!=', 'iso_3166_1_alpha_3', 'IND']);

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

      // Add location tags with hyperlinks
      const locationTags = [
        {
          name: 'New Delhi',
          coordinates: [77.2090, 28.6139],
          link: 'https://heyzine.com/flip-book/d8c1c5c1e9.html#page/4',
        },
        {
          name: 'Mumbai',
          coordinates: [72.8777, 19.0759],
          link: 'https://en.wikipedia.org/wiki/Mumbai',
        },
        {
          name: 'Bengaluru',
          coordinates: [77.5946, 12.9716],
          link: 'https://heyzine.com/flip-book/d8c1c5c1e9.html#page/6',
        },
        {
          name: 'Hyderabad',
          coordinates: [78.4867, 17.3850],
          link: 'https://en.wikipedia.org/wiki/Hyderabad',
        },
        {
          name: 'Chennai',
          coordinates: [80.2707, 13.0827],
          link: 'https://en.wikipedia.org/wiki/Chennai',
        },
      ];

      locationTags.forEach((location) => {
        const marker = new maplibregl.Marker({
          color: 'rgba(255, 165, 0, 0.8)', // Orange with 80% opacity
          scale: 0.5, // Scale the marker to 0.5x
        })
        .setLngLat(location.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 25 }) // Offset the popup by 25px
          .setHTML(`<a href="${location.link}" target="_blank">${location.name}</a>`))
        .addTo(map);
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