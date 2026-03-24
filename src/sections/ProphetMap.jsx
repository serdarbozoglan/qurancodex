import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import * as topojson from 'topojson-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../i18n/LanguageContext';

const LOCATIONS = {
  musa: [
    {
      id: 'nil', lat: 30.5, lon: 31.2,
      nameTr: 'Nil Deltası — Mısır', nameEn: 'Nile Delta — Egypt',
      phaseTr: 'Doğum & Firavun\'un Sarayında Büyüme',
      phaseEn: 'Birth & Upbringing in Pharaoh\'s Palace',
    },
    {
      id: 'medyen', lat: 28.5, lon: 34.8,
      nameTr: 'Medyen / Sinai', nameEn: 'Midian / Sinai',
      phaseTr: 'Çoban Yılları & İlk Vahiy (Yanık Çalı)',
      phaseEn: 'Shepherd Years & First Revelation (Burning Bush)',
    },
    {
      id: 'misir', lat: 30.06, lon: 31.24,
      nameTr: 'Mısır — Firavun Sarayı', nameEn: 'Egypt — Pharaoh\'s Court',
      phaseTr: 'Firavun\'a Karşı 9 Mucize',
      phaseEn: '9 Miracles Against Pharaoh',
    },
    {
      id: 'kizildeniz', lat: 29.9, lon: 32.6,
      nameTr: 'Kızıldeniz Geçişi', nameEn: 'Red Sea Crossing',
      phaseTr: 'Denizin Yarılması — Firavun\'un Boğulması',
      phaseEn: 'Parting of the Sea — Pharaoh\'s Drowning',
    },
    {
      id: 'tur-i-sina', lat: 28.54, lon: 33.97,
      nameTr: 'Tûr-i Sînâ', nameEn: 'Mount Sinai',
      phaseTr: 'Tevrat\'ın İnişi & 40 Gece',
      phaseEn: 'Revelation of the Torah & 40 Nights',
    },
    {
      id: 'kenan', lat: 31.8, lon: 35.2,
      nameTr: 'Kenan Diyarı', nameEn: 'Land of Canaan',
      phaseTr: 'İsrailoğullarının Yolculuğu & Vaat Edilen Toprak',
      phaseEn: 'Journey of the Israelites & the Promised Land',
    },
  ],
  ibrahim: [
    {
      id: 'ur', lat: 30.96, lon: 46.1,
      nameTr: 'Ur — Irak', nameEn: 'Ur — Iraq',
      phaseTr: 'Doğum, Putlara Başkaldırı & Ateşe Atılma',
      phaseEn: 'Birth, Revolt Against Idols & Cast into Fire',
    },
    {
      id: 'harran', lat: 36.87, lon: 39.02,
      nameTr: 'Harran — Güneydoğu Türkiye', nameEn: 'Harran — SE Turkey',
      phaseTr: 'Hicret Güzergâhı — Babası ile Son Ayrılık',
      phaseEn: 'Migration Route — Final Parting from Father',
    },
    {
      id: 'kenan-ibrahim', lat: 31.5, lon: 35.0,
      nameTr: 'Kenan Diyarı / Filistin', nameEn: 'Land of Canaan / Palestine',
      phaseTr: 'İkâmet, Meleklerin Ziyareti & İsmail\'in Doğumu',
      phaseEn: 'Settlement, Angels\' Visit & Birth of Ismail',
    },
    {
      id: 'mekke', lat: 21.42, lon: 39.82,
      nameTr: 'Mekke', nameEn: 'Mecca',
      phaseTr: 'Kâbe\'nin İnşası, İsmail\'in Kurban Edilmesi & Hac\'ın Emri',
      phaseEn: 'Building the Kaaba, Sacrifice of Ismail & Command of Hajj',
    },
  ],
  yusuf: [
    {
      id: 'kenan-yusuf', lat: 31.8, lon: 35.2,
      nameTr: 'Kenan Diyarı', nameEn: 'Land of Canaan',
      phaseTr: 'Rüya & Kardeşleri Tarafından Kuyuya Atılma',
      phaseEn: 'The Dream & Cast into the Well by Brothers',
    },
    {
      id: 'misir-yusuf', lat: 30.06, lon: 31.24,
      nameTr: 'Mısır', nameEn: 'Egypt',
      phaseTr: 'Kölelik → Saray → İftira → Hapishane → Mısır Vezirliği',
      phaseEn: 'Slavery → Palace → False Accusation → Prison → Vizierate',
    },
  ],
  isa: [
    {
      id: 'beytullahim', lat: 31.55, lon: 35.08,
      nameTr: 'Beytüllahim', nameEn: 'Bethlehem',
      phaseTr: 'Doğum & Beşikte Konuşma',
      phaseEn: 'Birth & Speech in the Cradle',
    },
    {
      id: 'nasira', lat: 32.7, lon: 35.3,
      nameTr: 'Nasıra (Nazareth)', nameEn: 'Nazareth',
      phaseTr: 'Büyüme & İlk Tebliğ',
      phaseEn: 'Upbringing & Early Preaching',
    },
    {
      id: 'kudus', lat: 31.87, lon: 35.28,
      nameTr: 'Kudüs', nameEn: 'Jerusalem',
      phaseTr: 'Mucizeler, Havariler & Ref\' (Yükseltilme)',
      phaseEn: 'Miracles, Disciples & the Ascension',
    },
  ],
  nuh: [
    {
      id: 'mezopotamya', lat: 32.5, lon: 44.4,
      nameTr: 'Mezopotamya — Irak', nameEn: 'Mesopotamia — Iraq',
      phaseTr: '950 Yıllık Davet — Kavminin Sürekli İnkârı',
      phaseEn: '950 Years of Calling — People\'s Constant Denial',
    },
    {
      id: 'cudi', lat: 37.37, lon: 42.47,
      nameTr: 'Cudi Dağı — Şırnak, Türkiye', nameEn: 'Mount Judi — Şırnak, Turkey',
      phaseTr: 'Geminin İnişi — Tufanın Sonu & Yeni Başlangıç',
      phaseEn: 'Ark\'s Landing — End of the Flood & New Beginning',
    },
  ],
};

const PROPHET_VIEWS = {
  musa:    { center: [30.2, 33.0], zoom: 6 },
  ibrahim: { center: [31.5, 40.5], zoom: 5 },
  yusuf:   { center: [31.0, 33.2], zoom: 7 },
  isa:     { center: [32.1, 35.3], zoom: 7 },
  nuh:     { center: [34.5, 43.5], zoom: 6 },
};

// Sea: deep ocean blue — Land: warm dark earth → hue shift gives clear contrast
const LAND_STYLE = {
  fillColor: '#1c1a0e',
  color: '#2e2a16',
  weight: 0.7,
  fillOpacity: 1,
  opacity: 1,
};

// Gold palette — consistent with site's accent colors
const GOLD = '#d4a574';
const GOLD_LIGHT = '#f0c98a';
const GOLD_GLOW = 'rgba(212,165,116,0.55)';

function createMarkerIcon(number) {
  return L.divIcon({
    html: `<div class="pm-marker">
      <span>${number}</span>
    </div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function FitBounds({ prophetId, locations }) {
  const map = useMap();
  useEffect(() => {
    if (!locations.length) return;
    const positions = locations.map(l => [l.lat, l.lon]);
    if (positions.length === 1) {
      map.setView(positions[0], 7, { animate: true, duration: 1.2 });
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: [70, 70], animate: true, duration: 1.2 });
    }
  }, [prophetId]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function ProphetMap({ activeProphet, prophet }) {
  const { language } = useLanguage();
  const [countriesGeo, setCountriesGeo] = useState(null);

  const locations = LOCATIONS[activeProphet] || [];
  const positions = locations.map(l => [l.lat, l.lon]);
  const view = PROPHET_VIEWS[activeProphet] || { center: [30, 38], zoom: 5 };
  const tr = (t, e) => language === 'tr' ? t : e;

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(data => {
        const geo = topojson.feature(data, data.objects.countries);
        setCountriesGeo(geo);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ marginTop: '64px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px',
        }}>
          {tr('Coğrafi Atlas', 'Geographic Atlas')}
        </div>
        <h3 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
          fontWeight: 600, color: '#F8FAFC', margin: 0,
        }}>
          {tr(
            `${prophet.nameTr} Kıssasının Coğrafyası`,
            `Geography of ${prophet.nameEn}'s Narrative`,
          )}
        </h3>
      </div>

      {/* Map container */}
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        height: '480px',
        background: '#0B1220',
        position: 'relative',
      }}>
        {/* Top gradient overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0))',
          zIndex: 500, pointerEvents: 'none',
        }} />

        <MapContainer
          center={view.center}
          zoom={view.zoom}
          style={{ height: '100%', width: '100%', background: '#0B1220' }}
          zoomControl
          scrollWheelZoom={false}
          attributionControl={false}
        >
          {countriesGeo && (
            <GeoJSON
              key="countries"
              data={countriesGeo}
              style={() => LAND_STYLE}
            />
          )}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
            pane="shadowPane"
          />

          <FitBounds prophetId={activeProphet} locations={locations} />

          {/* Journey path — glow layer + solid gold line */}
          {positions.length > 1 && (<>
            <Polyline
              positions={positions}
              color={GOLD}
              weight={18}
              opacity={0.07}
            />
            <Polyline
              positions={positions}
              color={GOLD}
              weight={2}
              opacity={0.75}
              dashArray="6, 8"
            />
          </>)}

          {/* Markers */}
          {locations.map((loc, i) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lon]}
              icon={createMarkerIcon(i + 1)}
            >
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '190px' }}>
                  <div style={{
                    fontWeight: 600, fontSize: '0.88rem',
                    marginBottom: '6px', color: GOLD_LIGHT,
                  }}>
                    {language === 'tr' ? loc.nameTr : loc.nameEn}
                  </div>
                  <div style={{ fontSize: '0.81rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
                    {language === 'tr' ? loc.phaseTr : loc.phaseEn}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px 24px',
        marginTop: '18px', justifyContent: 'center',
      }}>
        {locations.map((loc, i) => (
          <div key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: `radial-gradient(circle at 38% 32%, ${GOLD_LIGHT}, ${GOLD})`,
              color: '#1B1208',
              fontSize: '11px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter, sans-serif',
              boxShadow: `0 0 10px ${GOLD_GLOW}`,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
              {language === 'tr' ? loc.nameTr : loc.nameEn}
            </span>
          </div>
        ))}
      </div>

      {/* Ordering note */}
      <p style={{
        textAlign: 'center', color: 'rgba(148,163,184,0.35)',
        fontSize: '0.74rem', marginTop: '10px', marginBottom: '0',
        fontStyle: 'italic',
      }}>
        {tr(
          'Numaralar nüzul veya mushaf sırası değil, peygamberin hayat yolculuğunun kronolojik sırasıdır.',
          'Numbers follow the chronological order of the prophet\'s life journey, not the Quranic or mushaf order.',
        )}
      </p>

      <style>{`
        .leaflet-container {
          background: #0B1220 !important;
          font-family: Inter, sans-serif !important;
        }

        /* Atlas-style gold markers */
        .pm-marker {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 32%, ${GOLD_LIGHT}, ${GOLD});
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 14px ${GOLD_GLOW}, 0 0 28px rgba(212,165,116,0.25);
          border: 1.5px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pm-marker:hover {
          transform: scale(1.12);
          box-shadow: 0 0 22px rgba(212,165,116,0.75), 0 0 44px rgba(212,165,116,0.35);
        }
        .pm-marker span {
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1B1208;
          line-height: 1;
        }

        /* Popup */
        .leaflet-popup-content-wrapper {
          background: #0F172A !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7) !important;
          color: #e8e6e3 !important;
          padding: 10px 12px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0F172A !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.4) !important;
          font-size: 16px !important;
          top: 6px !important;
          right: 8px !important;
        }

        /* Zoom controls */
        .leaflet-control-zoom a {
          background: #0F172A !important;
          color: rgba(255,255,255,0.5) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #e8e6e3 !important;
        }
      `}</style>
    </div>
  );
}
