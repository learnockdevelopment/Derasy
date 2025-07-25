// === app/api/github-commits/route.js ===
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    // 1. Verify environment variables
    if (!process.env.GITHUB_TOKEN || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'إعدادات النظام غير مكتملة' },
        { status: 500 }
      )
    }

    // 2. Fetch commits from GitHub
    const response = await fetch(
      'https://api.github.com/repos/learnockdevelopment/derasy/commits',
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'Derasy-Updates'
        }
      }
    )

    if (!response.ok) throw new Error('فشل في جلب التحديثات من GitHub')
    const commits = await response.json()

    // 3. Prepare batch translation prompt
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const commitMessages = commits.map(c => c.commit.message)
    const prompt = `
    قم بترجمة رسائل GitHub التالية إلى لغة عربية بسيطة للمستخدمين العاديين.
    لكل رسالة، اكتب شرحاً واحداً قصيراً يوضح الفائدة للمستخدم.
    أعد النتائج كـ JSON بهذا الشكل:
    {
      "translations": [
        {
          "original": "الرسالة الأصلية",
          "translated": "الشرح المبسط"
        }
      ]
    }

    الرسائل:
    ${JSON.stringify(commitMessages, null, 2)}
    `

    // 4. Get batch translations
    const result = await model.generateContent(prompt)
    const responseText = (await result.response).text()
    let translations = []

    try {
      // Extract JSON from Gemini's response
      const jsonStart = responseText.indexOf('{')
      const jsonEnd = responseText.lastIndexOf('}') + 1
      translations = JSON.parse(responseText.slice(jsonStart, jsonEnd)).translations
    } catch (e) {
      console.error('Failed to parse Gemini response:', e)
      throw new Error('فشل في معالجة الترجمة')
    }

    // 5. Combine with commit data
    const translatedCommits = commits.map((commit, index) => ({
      id: commit.sha.substring(0, 7),
      date: formatArabicDate(commit.commit.author.date),
      time: formatArabicTime(commit.commit.author.date),
      originalMessage: commit.commit.message,
      translatedMessage: translations[index]?.translated || 'تحديث تقني',
      author: commit.commit.author.name,
      avatar: commit.author?.avatar_url,
      url: commit.html_url
    }))

    return NextResponse.json({
      system: "نظام ديراسي",
      updates: translatedCommits,
      lastUpdated: formatArabicDateTime(new Date()),
      total: translatedCommits.length
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'حدث خطأ في نظام التحديثات',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// ... keep the same helper functions ...
// Helper functions for Arabic formatting
function formatArabicDate(dateString) {
  return new Date(dateString).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatArabicTime(dateString) {
  return new Date(dateString).toLocaleTimeString('ar-EG', {
    hour: 'numeric',
    minute: 'numeric'
  })
}

function formatArabicDateTime(date) {
  return date.toLocaleString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function cleanTranslation(text) {
  return text.replace(/["\n]/g, '').trim()
}