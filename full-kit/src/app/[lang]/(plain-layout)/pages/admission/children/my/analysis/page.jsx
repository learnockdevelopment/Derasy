'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Optional: GitHub Flavored Markdown

export default function ChildrenAIAnalysisPage() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1] || '';

      const res = await fetch('/api/children/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل في تحليل البيانات');
      }

      setAnalysis(data.aiAnalysis);

      Swal.fire({
        icon: 'success',
        title: 'تم التحليل بنجاح',
        text: 'تم إرسال التحليل أيضًا إلى بريدك الإلكتروني.',
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl shadow-lg mt-10 font-[Cairo] text-right">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        🤖 تحليل ذكاء اصطناعي لبيانات أطفالك
      </h1>

      <p className="text-gray-700 text-center mb-4">
        اضغط على الزر أدناه لتحليل بيانات أطفالك واقتراح نوع المدرسة المناسبة لكل طفل.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-purple-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-purple-700 transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          {loading ? 'جاري التحليل...' : 'ابدأ التحليل'}
        </button>
      </div>

      {analysis && (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-inner leading-relaxed text-gray-800">
          <div className="prose prose-pink max-w-none text-right">
            <ReactMarkdown
              children={analysis}
              remarkPlugins={[remarkGfm]}
            />
          </div>

        </div>
      )}
    </div>
  );
}
