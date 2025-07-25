import jwt from 'jsonwebtoken'
import User from '@/models/User'
import School from '@/models/School'
import { cookies } from 'next/headers'
import { dbConnect } from './dbConnect'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/auth' // Your NextAuth config file

export async function getCurrentUser() {
  await dbConnect()
  const cookieStore = await cookies()
  const session = await getServerSession(authConfig)
  const jwtToken = cookieStore.get('token')?.value
  const accessToken = cookieStore.get('accessToken')?.value
  let user
  console.log("JWT Token:", session)
  try {
    // ✅ Handle custom JWT token
    if (jwtToken) {
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
      user = await User.findById(decoded.id).lean()
    }
    if (accessToken) {
      user = await User.findById(session.user.id).lean()
    }
    // ✅ Handle NextAuth (Google OAuth) session
    if (!user) {

      if (session?.user?.id) {
        user = await User.findOne({ email: session.user.id }).lean()

        // 👇 Optionally create user if not found
        if (!user) {
          user = await User.create({
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image,
            role: 'parent',
            emailVerified: true,
          })
          user = user.toObject()
        }
      }
    }

    if (!user) return null

    // ✅ Get owned schools
    const ownedSchools = await School.find({ 'ownership.owner': user._id })
      .populate('ownership.owner', 'fullName email')
      .populate('ownership.moderators', 'fullName email')
      .lean()

    return {
      ...user,
      token: jwtToken, // may be undefined if Google user
      ownedSchools,
    }
  } catch (err) {
    console.error('❌ Error in getCurrentUser:', err)
    return null
  }
}
