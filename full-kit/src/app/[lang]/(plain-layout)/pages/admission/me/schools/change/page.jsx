'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ChangeOwnershipPage() {
  const [allSchools, setAllSchools] = useState([]);
  const [mySchools, setMySchools] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allRes, myRes] = await Promise.all([
          fetch('/api/schools/view'), // all schools
          fetch('/api/schools/my'), // owned by current user
        ]);

        const [allData, myData] = await Promise.all([allRes.json(), myRes.json()]);

        setAllSchools(allData.schools || []);
        const myIds = (myData.schools || []).map((s) => s._id);
        setMySchools(myIds);
        setSelectedIds(myIds); // pre-select current ownership
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSave() {
    try {
      const res = await fetch('/api/schools/my/change', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolIds: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({ icon: 'success', title: 'تم تحديث الملكية بنجاح' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
    }
  }

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 font-[Cairo]">
      <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
        تغيير المدارس المملوكة
      </h1>

      <ul className="space-y-4">
        {allSchools.map((school) => (
          <li key={school._id} className="border p-4 rounded-xl flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(school._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, school._id]);
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== school._id));
                  }
                }}
              />
              <span className="font-semibold">{school.name}</span>
            </label>
            <span className="text-sm text-gray-500">{school.type}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}
