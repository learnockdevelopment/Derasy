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

Return the results in **Egyptian Arabic (العامية المصرية)**, formatted in **markdown**. For each suggested school:

- Include the school's \`_id\` in the beginning like this: \`[school_id_here]\`
- Then write the school name and the reason it was selected.
- Only choose schools from the given list.
- Make sure you select exactly 3 schools.

At the end of your response, add a new section:

### ✅ Suggested School IDs:
\`["id1", "id2", "id3"]\`
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    let markdownSuggestions = geminiResponse.text();
    const htmlSuggestions = marked(markdownSuggestions);

    // ✅ Extract suggested IDs from markdown
    const idMatch = markdownSuggestions.match(/Suggested School IDs:\s*`(.*?)`/);
    let suggestedIds = [];

    if (idMatch && idMatch[1]) {
      const raw = idMatch[1].trim();
      try {
        suggestedIds = JSON.parse(raw);
      } catch {
        // Fallback if Gemini returns unquoted array
        suggestedIds = raw
          .replace(/[\[\]]/g, '')
          .split(',')
          .map((id) => id.trim().replace(/^"|"$/g, ''));
      }
    }

    // ✅ Remove all `[some_id]` patterns from markdown
    markdownSuggestions = markdownSuggestions.replace(/\[`?([^\]]+?)`?\]\s*/g, '');

    // ✅ Remove "Suggested School IDs" section completely
    markdownSuggestions = markdownSuggestions.replace(/### ✅ Suggested School IDs:\s*`[^`]*`\s*/g, '');
    return Response.json({
      message: 'تم إنشاء الترشيحات بنجاح',
      markdown: markdownSuggestions,
      html: marked(markdownSuggestions),
      suggestedIds,
    });
  } catch (err) {
    console.error('Error generating suggestions:', err);
    return Response.json(
      { message: 'حدث خطأ داخلي', error: err.message },
      { status: 500 }
    );
  }
}
