'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDays, GitCommit, Github, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function UpdateStatus() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري التهيئة...');

  useEffect(() => {
    const fetchLatestCommits = async () => {
      try {
        setLoading(true);
        setProgress(35);
        setStatus('جاري الاتصال بالخادم...');

        const res = await fetch("/api/github-commits");
        setProgress(30);
        
        if (!res.ok) {
          throw new Error('حدث خطأ أثناء جلب التحديثات');
        }

        setStatus('جاري معالجة البيانات...');
        setProgress(60);
        
        const data = await res.json();
        setProgress(80);
        setStatus('جاري عرض النتائج...');

        setTimeout(() => {
          setCommits(data);
          setProgress(100);
          setStatus('تم التحميل بنجاح');
          setTimeout(() => setLoading(false), 500);
        }, 300);

      } catch (err) {
        setError(err.message);
        setStatus('حدث خطأ');
        setProgress(0);
      }
    };

    fetchLatestCommits();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-8 bg-background p-6 text-right">
      <div className="flex flex-col-reverse items-center gap-8 md:flex-row">
        <Image
          src="/images/illustrations/characters/character-01.svg"
          alt="جاري التطوير"
          height={280}
          width={200}
          priority
          className="dark:invert-[.85]"
        />

        <div className="space-y-4 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">
            آخر التحديثات
          </h1>
          <p className="text-lg text-muted-foreground">
            نحن نعمل باستمرار على تحسين التطبيق. إليك أحدث التغييرات:
          </p>

          <div className="flex items-center gap-2 justify-start">
            <span className="text-sm font-medium">
              مستودع التطوير
            </span>
            <Github className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 justify-start">
          <GitCommit className="h-5 w-5" />
          آخر التغييرات
          
        </h2>

        {error ? (
          <div className="text-center py-8 text-destructive">
            {error}
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{status}</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {commits.updates?.length > 0 ? (
              commits.updates.map((commit) => (
                <div
                  key={commit.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow text-right"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-start">
                    <CalendarDays className="h-4 w-4" />
                    <span>{commit.date}</span>
                  </div>
                  <p className="font-medium">{commit.translatedMessage}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    بواسطة {commit.author}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد تحديثات حديثة
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          size="lg" 
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          {loading ? 'جاري التحديث...' : 'تحديث الصفحة'}
        </Button>
      </div>
    </div>
  );
}