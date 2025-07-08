import { marked } from 'marked';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { child, schools } = await req.json();

    if (!child || !Array.isArray(schools) || schools.length === 0) {
      return Response.json({ message: 'بيانات غير كافية' }, { status: 400 });
    }

    const prompt = `
Based on the following Egyptian child's school application data, suggest the top 3 most suitable schools from the list.

## Child:
${JSON.stringify(child, null, 2)}

## Schools:
${JSON.stringify(schools, null, 2)}

Return the results in **Arabic**, formatted in **markdown**. For each suggested school, explain **why** it is suitable (e.g., matching grade, religion, location, special needs, etc.).
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // You may also use 'gemini-pro' or 'gemini-2.0-flash'

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const markdownSuggestions = geminiResponse.text();
    const htmlSuggestions = marked(markdownSuggestions);

    return Response.json({
      message: 'تم إنشاء الترشيحات بنجاح',
      markdown: markdownSuggestions,
      html: htmlSuggestions
    });
  } catch (err) {
    console.error('Error generating suggestions:', err);
    return Response.json(
      { message: 'حدث خطأ داخلي', error: err.message },
      { status: 500 }
    );
  }
}
