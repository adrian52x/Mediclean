import Link from 'next/link';

export default function LogoWithText() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="flex items-center">
        <img src="/med-logo.png" alt="Mediclean Logo" className="h-26 w-26" />
        <div className="flex flex-col">
          <span
            className="text-[1.5rem] font-bold tracking-wide"
            id="main-text"
          >
            MEDICLEAN
          </span>
          <span
            className="text-muted-foreground text-[0.6rem] uppercase"
            style={{
              width: '100%',
              display: 'block',
              //   letterSpacing: "-0.02em",
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
