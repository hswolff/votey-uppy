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

export const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1 className={classNames('text-center text-4xl text-purple-800', className)}>
    {children}
  </h1>
);

export const Header2 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1 className={classNames('text-center text-2xl text-purple-800', className)}>
    {children}
  </h1>
);
