// === app/api/chat/route.js ===
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authenticate } from '@/middlewares/auth'
import { withLogging } from '@/middlewares/logger'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import Child from '@/models/Child'
import School from '@/models/School'
import Application from '@/models/Application'

async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ message: 'Method not allowed' }, { status: 405 })
    }

    await dbConnect()
    const user = await authenticate(req)
    if (!user || user.message) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { message, history = [] } = await req.json()
    if (!message) {
      return Response.json({ message: 'Missing message content' }, { status: 400 })
    }

    const fullUser = await User.findById(user.id).lean()
    const children = await Child.find({ parent: user.id }).lean()
    const applications = await Application.find({ parent: user.id })
      .populate('school')
      .populate('child')
      .lean()

    const language = /[\u0600-\u06FF]/.test(message) ? 'Arabic' : 'English'

    const systemContext = `
You are a helpful and smart educational assistant inside a Derasy which is Egyptian school admission platform. You help parents understand their children's applications, status, and school recommendations.

Speak in the same language as the user: ${language}.

Here is the parent data:
${JSON.stringify({ name: fullUser.name, email: fullUser.email, phone: fullUser.phone }, null, 2)}

Here are their children:
${JSON.stringify(children, null, 2)}

Here are their applications:
${JSON.stringify(applications, null, 2)}

Now respond to the user's message appropriately based on this context.
    `

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemContext }] },
        ...history.map((msg) => ({
          role: msg.from === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }))
      ]
    })

    const result = await chat.sendMessage(message)
    const geminiReply = result.response.text()

    return Response.json({ reply: geminiReply })
  } catch (err) {
    console.error('❌ Error in chat API:', err)
    return Response.json({ message: 'Internal Server Error', error: err.message }, { status: 500 })
  }
}

export const POST = withLogging(handler)
