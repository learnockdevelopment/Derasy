// /app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import { dbConnect } from "@/lib/dbConnect"

export async function GET(req) {
  await dbConnect()

  const code = req.nextUrl.searchParams.get("code")
  if (!code) return NextResponse.redirect("/login?error=missing_code")

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenRes.json()
    const { id_token } = tokenData

    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`)
    const profile = await userInfoRes.json()

    const { email, name, picture } = profile
    if (!email) throw new Error("Invalid Google account")

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        emailVerified: true,
        password: "", // Or random
      })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const redirectTarget = user.role === "admin" ? "/dashboards/crm" : "/pages/admission/me"

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${redirectTarget}?token=${token}`)
  } catch (error) {
    console.error("OAuth Callback Error:", error)
    return NextResponse.redirect("/login?error=oauth_failed")
  }
}
