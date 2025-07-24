// src/auth.ts
import GoogleProvider from 'next-auth/providers/google';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        await dbConnect();
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // Create new user in MongoDB
          user = await User.create({
            name: profile.name,
            email: profile.email,
            password: "123456", // Since it's Google auth
            emailVerified: true,
            role: 'parent', // or default role
            avatar: profile.picture,
          });
        }

        token.id = user._id.toString();
        token.role = user.role;
        token.accessToken = account.access_token;
        token.avatar = user.avatar || profile.picture;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.avatar = token.picture;
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
  },
};
