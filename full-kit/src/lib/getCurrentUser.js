import jwt from 'jsonwebtoken'
import User from '@/models/User'
import School from '@/models/School'
import { cookies } from 'next/headers'
import { dbConnect } from './dbConnect'

export async function getCurrentUser() {
  await dbConnect()

  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get the user from DB
    const user = await User.findById(decoded.id).lean()
    if (!user) return null

    // Get schools where user is the owner
    const ownedSchools = await School.find({ 'ownership.owner': user._id })
      .populate('ownership.owner', 'fullName email')
      .populate('ownership.moderators', 'fullName email')
      .lean()

    return {
      ...user,
      token,
      ownedSchools, // ✅ Include owned schools
    }
  } catch (err) {
    console.error('❌ Error in getCurrentUser:', err)
    return null
  }
}
