'use client';

import Select from 'react-select';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Languages, ShieldCheck, MapPin, Globe2 } from 'lucide-react';
import SearchBox from './SearchBox';
// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function LocationPicker({ formData, setFormData }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({
        ...prev,
        location: { lat, lng },
      }));
    },
  });
  return formData.location ? (
    <Marker position={[formData.location.lat, formData.location.lng]} />
  ) : null;
}

export default function HealthAndLocationStep({ formData, setFormData, handleChange, governorates }) {
  const languageOptions = [
    { value: 'Arabic', label: 'العربية' },
    { value: 'English', label: 'الإنجليزية' },
    { value: 'French', label: 'الفرنسية' },
    { value: 'German', label: 'الألمانية' },
    { value: 'Other', label: 'أخرى' },
  ];

  return (
    <div className="space-y-6">
      {/* Language Preference */}
      <div>
        <label className="block font-semibold mb-1 flex items-center gap-2">
          <Languages className="w-5 h-5 text-muted-foreground" /> اللغة الأساسية
        </label>
        <Select
          name="languagePreference.primaryLanguage"
          value={
            languageOptions.find(
              (option) => option.value === formData.languagePreference.primaryLanguage
            ) || null
          }
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              languagePreference: {
                ...prev.languagePreference,
                primaryLanguage: selected ? selected.value : '',
              },
            }))
          }
          options={languageOptions}
          placeholder="اختر اللغة"
          classNamePrefix="select"
          isClearable
          aria-describedby="primaryLanguageHelp"
        />
        <p id="primaryLanguageHelp" className="text-sm text-gray-500 mt-1">
          اختر اللغة الأساسية لتعليم الطفل
        </p>
      </div>

      {/* Secondary Language */}
      <div>
        <label htmlFor="languagePreference.secondaryLanguage" className="block font-semibold mb-1">
          <Globe2 className="inline-block w-5 h-5 mr-1 text-muted-foreground" />
          اللغة الثانوية
        </label>
        <input
          type="text"
          id="languagePreference.secondaryLanguage"
          name="languagePreference.secondaryLanguage"
          value={formData.languagePreference.secondaryLanguage}
          onChange={handleChange}
          placeholder="مثال: الإنجليزية"
          className="w-full border border-gray-300 rounded p-2"
          aria-describedby="secondaryLanguageHelp"
        />
        <p id="secondaryLanguageHelp" className="text-sm text-gray-500 mt-1">
          أدخل اللغة الثانوية إن وجدت
        </p>
      </div>

      {/* Health Status */}
      <div>
        <label className="block font-semibold mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-muted-foreground" /> هل تم تطعيم الطفل؟
        </label>
        <div className="flex gap-4 mt-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="healthStatus.vaccinated"
              value="true"
              checked={formData.healthStatus.vaccinated === true}
              onChange={handleChange}
              className="form-radio"
            />
            <span>نعم</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="healthStatus.vaccinated"
              value="false"
              checked={formData.healthStatus.vaccinated === false}
              onChange={handleChange}
              className="form-radio"
            />
            <span>لا</span>
          </label>
        </div>
        <textarea
          name="healthStatus.notes"
          value={formData.healthStatus.notes}
          onChange={handleChange}
          placeholder="ملاحظات صحية إضافية"
          className="w-full border border-gray-300 rounded p-2 mt-2"
          aria-describedby="healthStatusHelp"
        />
        <p id="healthStatusHelp" className="text-sm text-gray-500 mt-1">
          أدخل أي ملاحظات صحية إضافية إن وجدت
        </p>
      </div>

      {/* Zone (governorate) */}
      <div>
        <label htmlFor="zone" className="block font-semibold mb-1 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" /> المنطقة
        </label>
        <Select
          id="zone"
          name="zone"
          options={governorates}
          value={governorates.find((option) => option.value === formData.zone) || null}
          onChange={(selected) =>
            setFormData((prev) => ({ ...prev, zone: selected ? selected.value : '' }))
          }
          placeholder="اختر المنطقة"
          classNamePrefix="select"
          isClearable
          aria-describedby="zoneHelp"
        />
        <p id="zoneHelp" className="text-sm text-gray-500 mt-1">
          اختر المنطقة أو اكتبها (سيتم ملؤها تلقائيًا من الرقم القومي إذا أدخلته)
        </p>
      </div>


    </div>
  );
}
