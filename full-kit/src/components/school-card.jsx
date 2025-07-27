"use client";

import Link from "next/link";
import { Building2, ExternalLink, Globe, MapPin, Phone } from "lucide-react";
import { Settings, Globe2, IdCard } from 'lucide-react'; // or your preferred icon lib

export default function SchoolCard({ school }) {
  return (
    <div
      key={school._id}
      className="rounded-xl overflow-hidden border bg-white text-gray-800 shadow-md transition-transform hover:scale-[1.015] min-w-[300px] p-5"
    >
      {/* Header Image + Overlay */}
      <div className="relative h-32">
        <img
          src={school.image || "/placeholder-school.jpg"}
          alt={school.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <div className="absolute top-2 left-2 bg-white text-purple-600 text-sm font-bold px-3 py-1 rounded shadow">
          عرض
        </div>
        <div className="absolute bottom-2 left-2 text-white font-semibold text-lg drop-shadow">
          {school.name}
        </div>
      </div>


      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500">
          <span className="font-semibold">نوع التعليم:</span>{" "}
          {school.type === "International"
            ? "دولي"
            : school.type === "Private"
              ? "خاص"
              : school.type}
        </div>

        {school.branches?.[0] && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> المنطقة
            </span>
            <span>
              {school.branches[0].zone} - {school.branches[0].governorate}
            </span>
          </div>
        )}

        {school.branches?.[0]?.contactPhone && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> الهاتف
            </span>
            <span>{school.branches[0].contactPhone}</span>
          </div>
        )}

        {school.website && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" /> الموقع الإلكتروني
            </span>
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline flex items-center gap-1"
            >
              زيارة <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        <div className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-1">💰 الرسوم</span>
          <span>
            {school.feesRange?.min?.toLocaleString("ar-EG")} -{" "}
            {school.feesRange?.max?.toLocaleString("ar-EG")} جنيه
          </span>
        </div>
      </div>


      {/* Footer Action */}
      <div className="py-4 border-t flex flex-wrap justify-end gap-4 font-[Cairo]">
        <Link
          href={`/pages/admission/me/schools/${school._id}`}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
          aria-label="إدارة المدرسة"
          title="إدارة المدرسة"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {school.website && (
          <Link
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-gray-800 p-3 rounded-full hover:bg-gray-200 transition"
            aria-label="زيارة الموقع"
            title="زيارة الموقع"
          >
            <Globe2 className="w-5 h-5" />
          </Link>
        )}

        <Link
          href={`/pages/admission/me/schools/${school._id}/pvc-id-generator`}
          className="bg-yellow-400 text-yellow-900 p-3 rounded-full hover:bg-yellow-500 transition"
          aria-label="إعداد كارت الطالب"
          title="إعداد كارت الطالب"
        >
          <IdCard className="w-5 h-5" />
        </Link>
      </div>


    </div>
  );
}
