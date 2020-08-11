import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  site: process.env.SITE || 'http://localhost:3000',

  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  database: process.env.DATABASE_URL,

  callbacks: {
    async session(session, user) {
      return Promise.resolve({
        ...session,
        user: {
          ...session.user,
          _id: user.id,
        },
      });
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
