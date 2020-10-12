import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';

export default function Filter<FilterType>({
  title,
  filterKey,
  items,
}: {
  title: string;
  filterKey: string;
  items: [string, FilterType][];
}) {
  const { query } = useRouter();

  const urlWithNewQuery = (newValue: FilterType | string) => {
    const newQuery = { ...query };
    newQuery[filterKey] = (newValue as unknown) as string;

    if (newValue === 'All') {
      delete newQuery[filterKey];
    }

    const stringifiedQuery = queryString.stringify(newQuery);

    if (stringifiedQuery === '') {
      return '/';
    }

    return `/?${stringifiedQuery}`;
  };

  return (
    <div className="z-10 relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <span className="rounded-md shadow-sm">
              <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-purple active:bg-gray-50 active:text-gray-800">
                <span>{title}</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Menu.Button>
            </span>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute left-0 w-32 mt-1 origin-bottom-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              >
                {items.map(([key, value]) => (
                  <Menu.Item key={key}>
                    {({ active }) => (
                      <NextLink
                        href={urlWithNewQuery(value)}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                      >
                        {key}
                      </NextLink>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}

function NextLink({
  href,
  children,
  ...rest
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}
