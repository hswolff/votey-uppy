import { Header, Anchor, Card } from 'components/Typography';

export default function About() {
  return (
    <Card className="flex flex-col space-y-4">
      <Header className="mb-4">Profile</Header>

      <p>
        Welcome to{' '}
        <Anchor
          className="text-purple-800 hover:text-purple-600"
          href="https://github.com/hswolff/votey-uppy"
        >
          votey-uppy
        </Anchor>
        , a place to collect and vote on ideas.
      </p>

      <p>
        The code is being developed in the open so follow along with the
        progress there!
      </p>
    </Card>
  );
}
