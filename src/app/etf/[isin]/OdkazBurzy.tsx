'use client';

/* „+ 3 další tickery“ v hlavičce detailu (kolo 5, 19. 10. 2026): dřív jen bublina – klik nic viditelně neudělal.
   Teď odscroluje na sekci burz a rozbalí „Další burzy“. Bez JS funguje jako obyčejný odkaz na #burzy. */
export default function OdkazBurzy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <a
      href="#burzy"
      title={title}
      onClick={(e) => {
        const sekce = document.getElementById('burzy');
        if (!sekce) return;
        e.preventDefault();
        const det = document.getElementById('dalsi-burzy') as HTMLDetailsElement | null;
        if (det) det.open = true;
        sekce.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#burzy');
      }}
      className="ml-1.5 text-xs text-slate-300 underline decoration-dotted underline-offset-2 hover:text-white"
    >
      {children}
    </a>
  );
}
