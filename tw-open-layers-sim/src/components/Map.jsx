import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap, View } from 'ol';
import { Fill, Stroke, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults as defaultControls } from 'ol/control';

export default function Map({ color = '#3498db', border = '#ffffff' }) {
  const hostRef = useRef(null);
  const mapRef  = useRef(null);

  // 1️⃣  Initialise once
  useEffect(() => {
    if (mapRef.current) return;          // guard
    mapRef.current = new OLMap({
      target: hostRef.current,
      controls: defaultControls({ attribution: false }),
      layers: [],                        // we’ll push vector layer later
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: 'EPSG:4326'         // works fine for world polygons
      })
    });

    // Fetch GeoJSON & add layer
    fetch('/map-data/custom.geo.json')
      .then(r => r.json())
      .then(json => {
        const vector = new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(json, {
              featureProjection: 'EPSG:4326'
            })
          }),
          style: new Style({
            fill:   new Fill({ color: hexToRgba(color, 0.2) }),
            stroke: new Stroke({ color: border, width: 1 })
          })
        });
        mapRef.current.addLayer(vector);

        // Fit view to layer extent
        const extent = vector.getSource().getExtent();
        mapRef.current.getView().fit(extent, { padding: [20, 20, 20, 20] });
      });

    return () => mapRef.current.setTarget(null);
  }, []);

  // 2️⃣  Update color live when prop changes
  useEffect(() => {
    const vector = mapRef.current
      ?.getLayers()
      .item(0); // our only layer
    if (vector) {
      vector.setStyle(
        new Style({
          fill:   new Fill({ color: hexToRgba(color, 0.6) }),
          stroke: new Stroke({ color: border, width: 1 })
        })
      );
      vector.changed(); // force redraw
    }
  }, [color, border]);

  return <div ref={hostRef} style={{ flex: 1, height: 'calc(100vh - 48px)', width: '100%' }} />;
}

/** Turn "#rrggbb" into "rgba(r,g,b,alpha)" */
function hexToRgba(hex, alpha = 0.5) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
