import Link from 'next/link';
import Image from 'next/image';

export default function LogoWithText() {
  return (
    <div className="flex">
      <Link href="/" className="flex h-16 items-center">
        <Image
          src="/images/med-logo.png"
          alt="Mediclean Logo"
          priority
          width={80}
          height={80}
        />
        <div className="flex flex-col">
          <span
        className="text-[1rem] font-bold tracking-wide md:text-[1.5rem]"
        id="main-text"
          >
        MEDICLEAN
          </span>
          <span
        className="text-muted-foreground text-[0.5rem] uppercase md:text-[0.6rem]"
        style={{
          width: '100%',
          display: 'block',
          transform: 'scaleX(0.85)',
          transformOrigin: 'left',
        }}
          >
        DESINFECTANTS & MEDICAL SUPPLIES
          </span>
        </div>
      </Link>
    </div>
  );
}
