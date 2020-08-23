import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { getUserFromId, updateUser } from 'services/user-dao';

const options = {
  site: process.env.SITE || 'http://localhost:3000',

  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  database: process.env.DATABASE_URL,

  session: {
    jwt: true,
  },

  callbacks: {
    async session(session, user) {
      return Promise.resolve({
        ...session,
        user: {
          ...session.user,
          _id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    },
    async jwt(token, user, _account, profile) {
      let response = token;

      if (user?.id) {
        let dbUser = await getUserFromId(user.id);

        if (!dbUser.username && profile.login) {
          dbUser = await updateUser(user.id, { username: profile.login });
        }

        response = {
          ...token,
          id: user?.id,
          username: dbUser.username,
          role: dbUser.role,
        };
      }

      return Promise.resolve(response);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
