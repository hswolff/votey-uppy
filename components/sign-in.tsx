import { useSession } from 'next-auth/client';
import { signin, signout } from 'next-auth/client';

function ExampleSession({ session }) {
  return (
    <p>
      {!session && (
        <>
          Not signed in <br />
          <a href="/api/auth/signin">Sign in</a>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <a href="/api/auth/signout">Sign out</a>
        </>
      )}
    </p>
  );
}

export default function SignIn() {
  const [session, loading] = useSession();

  return (
    <div>
      {/* <ExampleSession session={session} /> */}
      {session ? `Welcome ${session.user.name}` : null}
      <br />
      {session ? (
        <button onClick={signout}>Sign out</button>
      ) : (
        <button onClick={() => signin('github')}>Sign in</button>
      )}
    </div>
  );
}
