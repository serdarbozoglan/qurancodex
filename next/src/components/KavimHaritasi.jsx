'use client';

// ─── KavimHaritasi — react-leaflet'in YALNIZCA burada olmasinin sebebi ──────
// react-leaflet MODUL DUZEYINDE `window`'a dokunur, yani sunucuda import
// edilemez. Eskiden bu yuzden KavimlerAtlasi'nin TAMAMI `ssr: false` ile
// kapatiliyordu ve olculdugunde sayfanin ilk HTML'inde iceriginin yalnizca
// %4'u vardi: 7.310 karakterlik kavim anlatisi, arkeolojik notlar ve kaynak
// kunyeleri arama motoruna hic ulasmiyordu.
//
// Cozum: SSR'i bozan tek parca burada izole edildi. Sayfanin geri kalani
// sunucuda render edilir; yalnizca harita istemcide yuklenir.
// ────────────────────────────────────────────────────────────────────────────

import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { COLORS, RADIUS, SEMANTIC } from '../tokens';
import { NATION_REGIONS, STATUS_COLOR } from '../data/kavimRegions';


export default function KavimHaritasi({ tr, isMobile, activeRegion, setActiveRegion }) {
  return (
      <MapContainer
        center={[28, 40]}
        zoom={isMobile ? 3 : 4}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {NATION_REGIONS.map(region => (
          <Circle
            key={region.id}
            center={[region.lat, region.lon]}
            radius={region.radiusKm * 1000}
            pathOptions={{
              color: region.color,
              fillColor: region.color,
              fillOpacity: region.status === 'confirmed' ? 0.18 : 0.10,
              weight: region.status === 'confirmed' ? 2 : 1.5,
              dashArray: region.status === 'debated' ? '6 4' : null,
            }}
            eventHandlers={{ click: () => setActiveRegion(region.id === activeRegion ? null : region.id) }}
          >
            <Popup>
              <div style={{ fontFamily: "'Inter', sans-serif", minWidth: '180px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px', color: region.color }}>
                  {tr ? region.nameTr : region.nameEn}
                </div>
                <div style={{
                  display: 'inline-block', fontSize: '0.65rem', fontWeight: 600,
                  padding: '1px 7px', borderRadius: RADIUS.chip, marginBottom: '6px',
                  background: `${STATUS_COLOR[region.status]}20`,
                  border: `1px solid ${STATUS_COLOR[region.status]}50`,
                  color: STATUS_COLOR[region.status],
                }}>
                  {region.status === 'confirmed'
                    ? (tr ? 'Teyitli' : 'Confirmed')
                    : (tr ? 'Tartışmalı' : 'Debated')}
                </div>
                <div style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint, lineHeight: 1.5 }}>
                  {tr ? region.sourceTr : region.sourceEn}
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
  );
}
