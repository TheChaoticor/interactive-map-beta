import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error('Map container is null');
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: '/style.json', // Replace with the path or URL to your indiastyle.json
      center: [78.9629, 20.5937],
      zoom: 5,
    });

    map.on('load', () => {
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
