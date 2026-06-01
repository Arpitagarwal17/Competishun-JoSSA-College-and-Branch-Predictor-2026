export function CompetishunLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/competishun-logo-display.png"
      alt="Competishun - The Power of Real Gurus"
      className={
        compact
          ? "h-8 w-[190px] max-w-[54vw] object-contain object-left sm:h-10 sm:w-[238px]"
          : "h-12 w-[320px] max-w-full object-contain object-left xl:h-[54px] xl:w-[348px]"
      }
    />
  );
}
