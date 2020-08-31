import classNames from 'classnames';

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'border border-purple-100  rounded-md shadow-md hover:shadow-lg p-4 ease-linear transition duration-150',
        className
      )}
    >
      {children}
    </div>
  );
}

export const Header = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-center text-4xl">{children}</h1>
);
