import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { SessionUser } from 'services/data-types';
import { getUserFromId, updateUser } from 'services/user-dao';

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],

  database: process.env.DATABASE_URL,

  session: {
    jwt: true,
  },

  callbacks: {
    async session(session, user) {
      const sessionUser: SessionUser = {
        ...session.user,
        _id: user.id,
        username: user.username,
        role: user.role,
      };

      return Promise.resolve({
        ...session,
        user: sessionUser,
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

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
