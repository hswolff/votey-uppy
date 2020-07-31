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
  const [session] = useSession();

  return (
    <div className="max-w-xs mx-auto m-6 pb-2 border-b flex justify-between">
      {/* <ExampleSession session={session} /> */}
      <div>{session ? `Welcome ${session.user.name}` : null}</div>
      <div>
        {session ? (
          <button onClick={signout}>Sign out</button>
        ) : (
          <button onClick={() => signin('github')}>Sign in</button>
        )}
      </div>
    </div>
  );
}
