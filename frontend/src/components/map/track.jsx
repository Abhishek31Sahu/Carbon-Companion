import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";
import length from "@turf/length";
import { lineString } from "@turf/helpers";
import KalmanFilter from "kalmanjs";

// ✅ Put your token in .env file as REACT_APP_MAPBOX_TOKEN
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const LiveMapTracker = ({ dist }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // store map instance
  const [coords, setCoords] = useState([[77.5946, 12.9716]]);
  const [distance, setDistance] = useState(0);
  const markerRef = useRef(null); // store marker instance

  // 🔹 Kalman filters for latitude & longitude
  const kalmanLat = useRef(new KalmanFilter({ R: 0.01, Q: 3 }));
  const kalmanLng = useRef(new KalmanFilter({ R: 0.01, Q: 3 }));

  useEffect(() => {
    if (mapRef.current) return; // prevent re-initialization

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716], // default center
      zoom: 14,
    });

    mapRef.current.on("load", () => {
      // Add empty route once
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
        },
      });

      mapRef.current.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4CAF50",
          "line-width": 10,
          "line-opacity": 0.3,
        },
      });
      mapRef.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4CAF50",
          "line-width": 5,
        },
      });
      mapRef.current.addSource("current-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapRef.current.addLayer({
        id: "current-point-layer",
        type: "circle",
        source: "current-point",
        paint: {
          "circle-radius": 8,
          "circle-color": "#ff0000",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Pulse outer ring
      mapRef.current.addLayer({
        id: "current-point-pulse",
        type: "circle",
        source: "current-point",
        paint: {
          "circle-radius": 12,
          "circle-color": "#ff0000",
          "circle-opacity": 0.5,
        },
      });
    });
  }, []);

  useEffect(() => {
    let radius = 12;
    let growing = true;

    function animate() {
      if (!mapRef.current) return;

      // Grow or shrink radius
      radius = growing ? radius + 0.3 : radius - 0.3;
      if (radius >= 20) growing = false;
      if (radius <= 12) growing = true;

      // Clamp opacity between 0 and 1
      const opacity = Math.max(0, Math.min(1, (20 - radius) / 20));

      if (mapRef.current.getLayer("current-point-pulse")) {
        mapRef.current.setPaintProperty(
          "current-point-pulse",
          "circle-radius",
          radius
        );
        mapRef.current.setPaintProperty(
          "current-point-pulse",
          "circle-opacity",
          opacity
        );
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  // 🛰️ Track Location with smoothing

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("Raw Coord:", [longitude, latitude], "Accuracy:", accuracy);

        // if (accuracy > 20) return;

        const smoothLat = kalmanLat.current.filter(latitude);
        const smoothLng = kalmanLng.current.filter(longitude);
        const newCoord = [smoothLng, smoothLat];

        setCoords((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const move = lineString([last, newCoord]);
            const moved = length(move, { units: "meters" });

            if (moved < 100) return prev; // too small move → ignore
          }

          // ✅ just return new array
          console.log("Adding Coord:", newCoord);
          console.log("Coords so far (latest):", [...prev, newCoord]);
          return [...prev, newCoord];
        });
      },
      console.error,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // 🔄 Update Route on Map
  useEffect(() => {
    // console.log("Updating map with coords:", coords);
    if (!mapRef.current || coords.length < 2) {
      const pointSource = mapRef.current.getSource("current-point");
      if (pointSource) {
        pointSource.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coords[0],
              },
            },
          ],
        });
      }
      mapRef.current.flyTo({
        center: coords[coords.length - 1],
        speed: 0.8,
      });
      return;
    }

    const source = mapRef.current.getSource("route");
    // console.log("Source:", source);
    if (!source) {
      console.warn("Route source not ready yet");
      return;
    }

    source.setData({
      type: "Feature",
      geometry: { type: "LineString", coordinates: coords },
    });

    mapRef.current.flyTo({
      center: coords[coords.length - 1],
      speed: 0.8,
    });
    console.log("Source:", source);
    // Remove marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    // first position in map
    markerRef.current = new mapboxgl.Marker()
      .setLngLat(coords[0])
      .addTo(mapRef.current);

    const pointSource = mapRef.current.getSource("current-point");
    if (pointSource) {
      pointSource.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: coords[coords.length - 1],
            },
          },
        ],
      });
    }

    // Calculate distance
    const route = lineString(coords);
    const totalDistance = length(route, { units: "kilometers" });
    setDistance(totalDistance);
    dist(totalDistance);
  }, [coords]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        textAlign: "center",
        height: "560px",
        width: "100%",
        position: "relative",
        // border: "4px solid #4CAF50",
        borderRadius: "20px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      }}
    >
      <div
        ref={mapContainer}
        style={{ height: "100%", width: "100%", borderRadius: "4" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 40,
          left: 40,
          background: "#fff",
          p: 1.5,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Distance: {distance.toFixed(2)} km
      </Box>
    </Box>
  );
};

export default LiveMapTracker;
