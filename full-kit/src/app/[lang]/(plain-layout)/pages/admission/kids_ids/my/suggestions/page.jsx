

'use client';



import { useState } from 'react';
import { Loader2, School } from 'lucide-react';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChildrenSuggestionsPage() {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    setLoading(true);
    setSuggestions('');

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1] || '';

      const res = await fetch('/api/schools/suggest', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل في جلب الترشيحات');
      }

      setSuggestions(data.markdown);

      Swal.fire({
        icon: 'success',
        title: 'تم التوليد بنجاح',
        text: 'تم إرسال الترشيحات أيضًا إلى بريدك الإلكتروني.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 rounded-xl shadow-lg mt-10 font-[Cairo] text-right">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        🏫 ترشيحات المدارس لأطفالك
      </h1>

      <p className="text-gray-700 text-center mb-4">
        اضغط على الزر أدناه للحصول على ترشيحات المدارس المناسبة لكل طفل بناءً على بياناته.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="bg-green-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-green-700 transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <School className="h-5 w-5" />}
          {loading ? 'جاري التوليد...' : 'ابدأ الترشح' }
        </button>
      </div>

      {suggestions && (
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-inner leading-relaxed text-gray-800">
          <div className="prose prose-green max-w-none text-right">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {suggestions}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
