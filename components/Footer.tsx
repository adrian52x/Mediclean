import Link from 'next/link';
import { Separator } from './ui/separator';

const data = [
  {
    label: 'LEGAL',
    links: [
      // {
      //   label: 'Privacy Policy',
      //   url: '/privacy',
      // },
      {
        label: 'Termeni & Conditii',
        url: '#terms',
      },
    ],
  },
  {
    label: 'RESURSE',
    links: [
      // {
      //   label: 'Blog',
      //   url: '/blog',
      // },
      // {
      //   label: 'Locatie',
      //   url: '#location',
      // },
      {
        label: 'Contact',
        url: '#services',
      },
    ],
  },
  {
    label: 'SUPPORT',
    links: [
      // {
      //   label: 'Telegram',
      //   url: '/telegram',
      // },
      {
        label: 'Intrebari',
        url: '#faq',
      },
    ],
  },
];

export default function Footer() {
    return (
        <footer className="w-full">
            <Separator className="my-12" />
            <div className="flex justify-between container mx-auto px-8">
                <Trademark />
                <Links />
            </div>
            <Separator className="mt-8 mb-6" />
        </footer>
    );
}

function Links() {
    return (
        <div className="grid grid-cols-3 justify-evenly gap-8 text-end sm:gap-6 mx-auto md:mx-0">
            {data.map(({ label, links }) => (
                <div key={label}>
                <h2 className="mb-3 text-sm uppercase">{label}</h2>
                <ul className="block space-y-1">
                    {links.map(({ label, url }) => (
                    <li key={label}>
                        <Link
                        href={url}
                        className="text-muted-foreground hover:text-foreground text-sm transition duration-300"
                        >
                        {label}
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
            ))}
        </div>
    );
}

function Trademark() {
    return (
        <div className="mb-6 hidden md:mb-0 md:block">
            <span className="flex flex-col">
                <h2 className="text-sm font-semibold whitespace-nowrap uppercase">
                DEZINFECT MD
                </h2>
                <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                © {new Date().getFullYear()} DEZINFECT™ . All Rights Reserved.
                </span>
            </span>
        </div>
    );
}
