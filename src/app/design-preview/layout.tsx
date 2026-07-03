import CompareTray from '@/components/design-preview/CompareTray';

/* Layout nového webu (design-preview) – přidává plovoucí lištu porovnání
   na všechny stránky, aby výběr fondů držel napříč navigací. */
export default function DesignPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CompareTray />
    </>
  );
}
