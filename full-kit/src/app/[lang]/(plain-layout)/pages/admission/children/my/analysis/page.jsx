'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/hooks/use-toast';

export default function ChildrenAIAnalysisPage() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');

    toast({
      title: 'جاري التحليل...',
      description: 'نقوم بمعالجة بيانات أطفالك.',
    });

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

      toast({
        title: '✅ تم التحليل بنجاح',
        description: 'تم إرسال التحليل أيضًا إلى بريدك الإلكتروني.',
      });
    } catch (error) {
      toast({
        title: '❌ حدث خطأ أثناء التحليل',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const bubbles = analysis
    .split('\n\n')
    .filter((p) => p.trim())
    .map((paragraph, idx) => ({
      key: `bubble-${idx}`,
      content: paragraph,
      alignment: idx % 2 === 0 ? 'start' : 'start',
    }));

  return (
    <div className="mx-auto p-6 mt-10 font-[Cairo] text-right">
      <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 rounded-3xl shadow-2xl p-10 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-md z-0 rounded-3xl" />
        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-extrabold text-center tracking-tight drop-shadow-lg">
            🤖 تحليل الذكاء الاصطناعي لبيانات أطفالك
          </h1>

          <p className="text-center text-white/90">
            اضغط الزر أدناه لتحليل بيانات أطفالك والحصول على اقتراحات ذكية للمدارس المناسبة.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="relative inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-purple-100 transition-all duration-300 group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-purple-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-purple-600 group-hover:scale-125 transition-transform" />
              )}
              {loading ? 'جاري التحليل...' : 'ابدأ التحليل'}
              <span className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 blur-xl rounded-full animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {bubbles.length > 0 && (
        <div className="mt-8 space-y-4">
          {bubbles.map(({ key, content, alignment }) => (
            <div
              key={key}
              className={`max-w-2xl p-4 rounded-xl shadow-md backdrop-blur-md bg-white/80 border border-purple-200 ${
                alignment === 'right' ? 'ml-auto text-right' : 'mr-auto text-left'
              }`}
            >
              <div className="prose prose-pink max-w-none prose-headings:text-purple-700 prose-ul:rtl prose-ol:rtl text-right">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
}
