import type { FC } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { propertyMapIcon } from "./location/propertyMapIcon";
import { usePropertyLocation } from "./location/usePropertyLocation";

interface PropertyLocationMapProps {
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  name: string;
}

export const PropertyLocationMap: FC<PropertyLocationMapProps> = (props) => {
  const location = usePropertyLocation(props);
  return (
    <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <MapHeader city={props.city} />
      {location.point ? <LeafletMap {...props} latitude={location.point.latitude} longitude={location.point.longitude} /> : <MapFallback loading={location.loading} />}
    </section>
  );
};

const MapHeader: FC<{ city: string }> = ({ city }) => (
  <div className="mb-4">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"><MapPin size={20} className="text-red-600" /> Lokasi Properti</h2>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{city}</p>
  </div>
);

const LeafletMap: FC<PropertyLocationMapProps & { latitude: number; longitude: number }> = (props) => (
  <div className="overflow-hidden rounded-xl border dark:border-slate-700">
    <MapContainer center={[props.latitude, props.longitude]} zoom={14} scrollWheelZoom={false} className="z-0 h-72 w-full md:h-96">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[props.latitude, props.longitude]} icon={propertyMapIcon}>
        <Popup><strong>{props.name}</strong><br />{props.address}</Popup>
      </Marker>
    </MapContainer>
  </div>
);

const MapFallback: FC<{ loading: boolean }> = ({ loading }) => (
  <div className="flex h-48 items-center justify-center rounded-xl border border-dashed text-sm text-gray-500 dark:border-slate-700 dark:text-gray-400">
    {loading ? "Memuat lokasi..." : "Lokasi belum tersedia"}
  </div>
);
