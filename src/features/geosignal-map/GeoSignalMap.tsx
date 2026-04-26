import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { SignalBadge } from "../../components/ui/SignalBadge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { getPlaceById } from "../../data/places";
import type { GeoZone, UserReport } from "../../types/domain";

interface GeoSignalMapProps {
  zones: GeoZone[];
  report: UserReport;
}

const zoneCoordinates: Record<string, { lat: number; lng: number; radius: number }> = {
  university: { lat: 32.2319, lng: -110.9501, radius: 1150 },
  "sabino-catalina": { lat: 32.3093, lng: -110.8234, radius: 2600 },
  downtown: { lat: 32.2226, lng: -110.9747, radius: 1250 },
  "south-tucson": { lat: 32.185, lng: -110.9687, radius: 1350 },
  marana: { lat: 32.4367, lng: -111.2254, radius: 3600 },
  "oro-valley": { lat: 32.3909, lng: -110.9665, radius: 2600 },
  vail: { lat: 32.0479, lng: -110.712, radius: 3200 },
  sahuarita: { lat: 31.9573, lng: -110.9556, radius: 2800 }
};

const signalMapColors = {
  low: { stroke: "#5f916d", fill: "#a7c9ad" },
  mild: { stroke: "#a87a27", fill: "#e7c978" },
  watch: { stroke: "#b86435", fill: "#df9c74" },
  review: { stroke: "#9c514d", fill: "#d79591" }
};

export function GeoSignalMap({ zones, report }: GeoSignalMapProps) {
  const [selectedZoneId, setSelectedZoneId] = useState(report.zoneId);
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];
  const place = getPlaceById(report.placeId);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [32.2226, -110.9747],
      zoom: 10,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const container = mapContainerRef.current;
    container.setAttribute("tabindex", "0");
    container.addEventListener("mouseenter", () => map.scrollWheelZoom.enable());
    container.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());
    container.addEventListener("focus", () => map.scrollWheelZoom.enable());
    container.addEventListener("blur", () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;

    layerRef.current.clearLayers();

    zones.forEach((zone) => {
      const coordinates = zoneCoordinates[zone.id];
      if (!coordinates) return;

      const colors = signalMapColors[zone.signalLevel];
      const isSelected = zone.id === selectedZoneId;

      const circle = L.circle([coordinates.lat, coordinates.lng], {
        radius: coordinates.radius,
        color: colors.stroke,
        fillColor: colors.fill,
        fillOpacity: isSelected ? 0.48 : 0.32,
        opacity: 0.9,
        weight: isSelected ? 4 : 2
      });

      circle
        .bindTooltip(`${zone.name}: ${zone.reportCount7d} reports`, {
          direction: "top",
          sticky: true
        })
        .on("click", () => {
          setSelectedZoneId(zone.id);
        });

      circle.addTo(layerRef.current!);
    });
  }, [zones, selectedZoneId]);

  useEffect(() => {
    const coordinates = zoneCoordinates[selectedZoneId];
    if (!coordinates || !mapRef.current) return;
    mapRef.current.flyTo([coordinates.lat, coordinates.lng], selectedZoneId === "marana" ? 10 : 11, {
      animate: true,
      duration: 0.7
    });
  }, [selectedZoneId]);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="GeoSignal Map"
        title="Pima County zone signals"
        description="Zones are aggregated areas, not individual report pins."
      />

      <div className="map-layout">
        <div className="physical-map-panel">
          <div ref={mapContainerRef} className="physical-map" aria-label="Physical Pima County signal map" />
          <div className="map-zoom-hint">Hover map to zoom with mouse wheel</div>
          <div className="map-legend" aria-label="Signal legend">
            <span><i className="legend-dot legend-low" /> Low</span>
            <span><i className="legend-dot legend-mild" /> Mild</span>
            <span><i className="legend-dot legend-watch" /> Watch</span>
            <span><i className="legend-dot legend-review" /> Review</span>
          </div>
        </div>

        <article className="zone-detail">
          <div className="zone-detail__header">
            <div>
              <span className="eyebrow">Selected zone</span>
              <h3>{selectedZone.name}</h3>
            </div>
            <SignalBadge level={selectedZone.signalLevel} />
          </div>
          <p>{selectedZone.description}</p>
          <div className="map-callout">
            <MapPin size={18} />
            <span>
              Latest report used {report.privacyLevel.toLowerCase()} for {place.label}.
            </span>
          </div>
          <div className="trend-box">
            <strong>{selectedZone.trend}</strong>
            <p>
              This does not mean a location caused illness. It highlights a correlation pattern
              that may deserve monitoring.
            </p>
          </div>
          <div className="tag-list">
            {selectedZone.factors.map((factor) => (
              <span key={factor}>{factor}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
