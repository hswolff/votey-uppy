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

  //   database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
