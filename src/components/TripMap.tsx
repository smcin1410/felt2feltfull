import React, { useRef, useEffect } from "react";

interface Marker {
  id: string;
  position: { lat: number; lng: number };
  label?: string;
}

interface TripMapProps {
  center: { lat: number; lng: number };
  markers: Marker[];
  selectedMarkerId?: string;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export default function TripMap({ center, markers, selectedMarkerId, onMarkerClick, className }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstances = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.google?.maps || !window.google.maps.marker?.AdvancedMarkerElement) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
    } else {
      mapInstance.current.setCenter(center);
    }
    // Remove old markers
    Object.values(markerInstances.current).forEach((m: any) => m.map = null);
    markerInstances.current = {};
    // Add new markers
    markers.forEach(marker => {
      const { AdvancedMarkerElement } = window.google.maps.marker;
      const markerOptions: any = {
        map: mapInstance.current!,
        position: marker.position,
        title: marker.label,
      };
      // Highlight selected marker
      if (selectedMarkerId === marker.id) {
        markerOptions.content = (() => {
          const el = document.createElement('div');
          el.style.background = '#ec4899';
          el.style.border = '2px solid #fff';
          el.style.borderRadius = '50%';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = '#fff';
          el.style.fontWeight = 'bold';
          el.textContent = marker.label || '';
          return el;
        })();
      } else {
        markerOptions.content = (() => {
          const el = document.createElement('div');
          el.style.background = '#181828';
          el.style.border = '2px solid #ec4899';
          el.style.borderRadius = '50%';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = '#ec4899';
          el.style.fontWeight = 'bold';
          el.textContent = marker.label || '';
          return el;
        })();
      }
      const m = new AdvancedMarkerElement(markerOptions);
      m.addListener('click', () => onMarkerClick?.(marker.id));
      markerInstances.current[marker.id] = m;
    });
    // Cleanup on unmount
    return () => {
      Object.values(markerInstances.current).forEach((m: any) => m.map = null);
      markerInstances.current = {};
    };
  }, [center, markers, selectedMarkerId, onMarkerClick]);

  return <div ref={mapRef} className={className || "w-full h-80 rounded-lg border-2 border-pink-500/40"} />;
} 