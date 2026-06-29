"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";

export default function AcaraPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Block */}
      <div className="flex items-center justify-between mb-8 bg-white border border-zinc-200/85 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004d3d] text-2xl font-bold">📅</span>
            <h1 className="text-2xl font-extrabold text-[#002d23]">Jadwal & Acara</h1>
          </div>
          <p className="text-sm text-zinc-500">
            Daftar rencana petualangan, latihan, dan agenda organisasi KAPALA
          </p>
        </div>
        <Button variant="primary" className="bg-[#004d3d] hover:bg-[#0b5c46]">
          <span>+</span> Buat Acara Baru
        </Button>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium bg-white rounded-3xl border border-zinc-200">
          Memuat daftar acara...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-12 text-center text-zinc-400 font-medium bg-white rounded-3xl border border-zinc-200">
          Belum ada jadwal acara yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => {
            const formattedDate = new Date(activity.date).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={activity.id}
                className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Image Header */}
                {activity.imageUrl ? (
                  <div className="h-48 w-full overflow-hidden relative bg-zinc-100">
                    <img
                      src={activity.imageUrl}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-[#002d23]/5 flex items-center justify-center text-5xl">
                    🏕️
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#002d23] mb-1">{activity.name}</h3>
                    <p className="text-xs font-semibold text-[#ea580c] mb-3">{formattedDate}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <span>👥</span> {activity.participantCount || 0} Siswa Terdaftar
                    </div>
                    <Button variant="outline" className="py-2 px-4 text-xs">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
