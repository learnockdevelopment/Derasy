'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDays, GitCommit, Github, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function UpdateStatus() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestCommits = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "/api/github-commits", // استخدم مسار API بدلاً من الاتصال المباشر
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!res.ok) {
          throw new Error('حدث خطأ أثناء جلب التحديثات');
        }

        const data = await res.json();
        console.log("Fetching commits from API...", data);
        setCommits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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

          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm font-medium">
              مستودع التطوير
            </span>
            <Github className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 justify-end">
          آخر التغييرات
          <GitCommit className="h-5 w-5" />
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        ) : error ? (
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
        ) : (
          <div className="space-y-3">
            {commits.updates.length > 0 ? (
              commits.updates.map((commit) => (
                <div
                  key={commit?.sha}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow text-right"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
                    <span>
                      {commit?.date}
                    </span>
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <p className="font-medium">{commit?.translatedMessage?.split('\n')[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    بواسطة {commit?.author}
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
  )
}