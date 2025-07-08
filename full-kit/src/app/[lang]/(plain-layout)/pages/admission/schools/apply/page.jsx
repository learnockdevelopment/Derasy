'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import ChildSelector from './ChildSelector';
import SelectedChildInfo from './SelectedChildInfo';
import SchoolCard from './SchoolCard';
import AdmissionBox from './AdmissionBox';
import { toast } from '@/hooks/use-toast';

export default function AdmissionPage() {
  const [children, setChildren] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedChild = children.find((c) => c._id === selectedChildId);
  const maxAdmissionFee = Math.max(...selectedSchools.map((s) => s.admissionFee?.amount || 0), 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const [childrenRes, schoolsRes] = await Promise.all([
          fetch('/api/children/get-related', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/schools/view'),
        ]);

        const childrenData = await childrenRes.json();
        const schoolsData = await schoolsRes.json();

        if (!childrenRes.ok || !schoolsRes.ok) throw new Error('فشل في تحميل البيانات');

        setChildren(childrenData.children || []);
        setSchools(
          (schoolsData.schools || []).sort(
            (a, b) => (b.admissionFee?.amount || 0) - (a.admissionFee?.amount || 0)
          )
        );
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDrop = (school) => {
    if (selectedSchools.length >= 3) {
      Swal.fire({
        icon: 'warning',
        title: 'الحد الأقصى',
        text: 'يمكنك اختيار 3 مدارس فقط.',
      });
      return;
    }
    if (!selectedSchools.some((s) => s._id === school._id)) {
      setSelectedSchools([...selectedSchools, school]);
    }
  };
  const handleSuggest = async () => {
    if (!selectedChildId) {
      return toast({
        title: '⚠️ برجاء اختيار طفل أولاً',
        variant: 'destructive',
      });
    }

    if (schools.length === 0) {
      return toast({
        title: 'ℹ️ لا توجد مدارس متاحة',
        variant: 'default',
      });
    }

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1] || '';

    toast({
      title: '⏳ يتم تحليل البيانات واقتراح المدارس...',
      variant: 'default',
    });

    try {
      const res = await fetch('/api/schools/suggest-three', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          child: selectedChild,
          schools: schools,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'فشل في توليد الترشيحات');

      toast({
        title: '🎓 الترشيحات جاهزة!',
        description: 'تم تحليل بيانات الطفل بنجاح',
      });

      // عرض الترشيحات في Dialog أو صفحة جديدة أو HTML Viewer
      const win = window.open('', '_blank');
      win.document.write(data.html);
      win.document.close();

    } catch (error) {
      toast({
        title: 'حدث خطأ أثناء تحليل البيانات',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  const handleRemove = (id) => {
    setSelectedSchools(selectedSchools.filter((s) => s._id !== id));
  };
  console.log(selectedSchools)
  const handleSubmitApplication = async () => {
    if (!selectedChild || selectedSchools.length === 0) {
      return toast({
        title: 'يرجى اختيار طفل ومدارس للتقديم',
        variant: 'destructive',
      });
    }

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1] || '';

    try {
      const res = await fetch('/api/admission/apply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChild._id,
          selectedSchools: selectedSchools,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'فشل في تقديم الطلب');

      toast({
        title: '📨 تم تقديم الطلب بنجاح',
        description: 'يرجى متابعة حالة الطلب من صفحة الطلبات.',
      });

      // Optional: reset selected schools
      setSelectedSchools([]);
    } catch (error) {
      toast({
        title: '❌ فشل في التقديم',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-[Cairo] text-right">
      <ChildSelector
        children={children}
        selectedChildId={selectedChildId}
        setSelectedChildId={setSelectedChildId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {selectedChild && (
        <>
          <SelectedChildInfo child={selectedChild} />

          <div className="text-center my-6">
            <button
              onClick={handleSuggest}
              className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              🎓 خد رأي دراسي
            </button>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* صندوق المدارس */}
        <div className="max-h-[75vh] overflow-y-auto pr-2 border rounded-lg bg-white shadow relative">
          <div className="sticky top-0 z-10 bg-white p-4 border-b">
            <input
              type="text"
              placeholder="🔍 ابحث عن مدرسة..."
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="p-4 space-y-4">
            {schools
              .filter((school) =>
                school?.name?.toLowerCase().includes(schoolSearch?.toLowerCase())
              )
              .map((school) => (
                <SchoolCard key={school._id} school={school} />
              ))}
          </div>
        </div>

        {/* صندوق التقديم */}
        <div className="space-y-6">
          <AdmissionBox
            selectedSchools={selectedSchools}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />

          {selectedSchools.length > 0 && (
            <div className="text-center bg-yellow-100 p-4 rounded-lg shadow-inner text-sm">
              يجب دفع مبلغ <span className="font-bold text-red-600">{maxAdmissionFee?.toLocaleString('ar-EG')} جنيه</span> كرسوم تقديم.
            </div>
          )}

          {selectedChild && selectedSchools.length > 0 && (
            <button
              onClick={handleSubmitApplication}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              📩 تقديم الطلب الآن
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
