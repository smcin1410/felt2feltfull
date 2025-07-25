import React, { useEffect, useState } from "react";

const GOOGLE_MAPS_SRC = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }
    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) {
      (window as any).initMap = () => setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = GOOGLE_MAPS_SRC + "&callback=initMap";
    script.async = true;
    (window as any).initMap = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      delete (window as any).initMap;
    };
  }, []);

  if (!loaded) {
    return <div className="w-full h-80 flex items-center justify-center text-pink-400">Loading map...</div>;
  }
  return <>{children}</>;
} 