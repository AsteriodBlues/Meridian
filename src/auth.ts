import NextAuth from 'next-auth';
import authConfig from './auth.config';

const nextAuth = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;