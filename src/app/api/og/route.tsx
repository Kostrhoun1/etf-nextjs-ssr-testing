/**
 * Dynamický OG obrázek (1200×630) pro sdílení na X/Facebooku.
 *
 * Použití v metadata stránky:  images: [ogImage({ title, eyebrow, stat, statLabel })]
 * (helper v src/lib/ogImage.ts). Bez parametrů vrací obecnou kartu webu.
 *
 * Design drží vizuál webu: tmavý ink podklad, teal akcent, rostoucí křivka
 * jako podpis značky. Fonty Inter 600/800 s latin-ext (česká diakritika) jsou
 * přibalené vedle routy – načítají se přes new URL(import.meta.url), což Vercel
 * korektně trasuje do bundle.
 */
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

const INK = '#0e1a16'
const INK_SOFT = '#15241f'
const TEAL = '#14b8a6'
const TEAL_DEEP = '#0d9488'
const PAPER = '#f4f7f6'
const MUTED = '#8aa39b'

async function loadFonts() {
  // fs.readFile s literálem process.cwd() – Vercel file tracing tyhle cesty
  // staticky rozpozná a TTF přibalí do server bundle. (new URL(import.meta.url)
  // tady nefunguje – webpack ji přepíše na relativní /_next/static asset.)
  const [semi, extra] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/api/og/Inter-600.ttf')),
    readFile(join(process.cwd(), 'src/app/api/og/Inter-800.ttf')),
  ])
  return [
    { name: 'Inter', data: semi, weight: 600 as const },
    { name: 'Inter', data: extra, weight: 800 as const },
  ]
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const title = (p.get('title') || 'Kolik reálně vyděláš. V korunách.').slice(0, 120)
  const eyebrow = (p.get('eyebrow') || 'ETF PRŮVODCE.CZ').slice(0, 60)
  const stat = p.get('stat')?.slice(0, 40)
  const statLabel = p.get('statLabel')?.slice(0, 60)

  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: INK,
          padding: '56px 64px',
          fontFamily: 'Inter',
          position: 'relative',
        }}
      >
        {/* rostoucí křivka – podpis značky */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d="M -20 560 C 180 545, 260 500, 380 505 C 500 510, 560 440, 680 430 C 800 420, 860 330, 980 300 C 1080 275, 1150 220, 1230 180"
            stroke={TEAL}
            strokeWidth="5"
            fill="none"
            opacity="0.55"
          />
          <path
            d="M -20 560 C 180 545, 260 500, 380 505 C 500 510, 560 440, 680 430 C 800 420, 860 330, 980 300 C 1080 275, 1150 220, 1230 180 L 1230 630 L -20 630 Z"
            fill={TEAL}
            opacity="0.07"
          />
        </svg>

        {/* hlavička: logo + doména */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: TEAL_DEEP,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M3 17 L9 11 L13 14 L21 6" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 6 L21 6 L21 12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: PAPER }}>
            ETF průvodce<span style={{ color: TEAL }}>.cz</span>
          </div>
        </div>

        {/* obsah */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: 22 }}>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: TEAL, letterSpacing: 4 }}>
            {eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 70 ? 52 : 62,
              fontWeight: 800,
              color: PAPER,
              lineHeight: 1.12,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {stat ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6 }}>
              <div style={{ display: 'flex', fontSize: 46, fontWeight: 800, color: TEAL }}>{stat}</div>
              {statLabel ? (
                <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, color: MUTED }}>{statLabel}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* patička */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
            paddingTop: 26,
            borderTop: `2px solid ${INK_SOFT}`,
          }}
        >
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: MUTED }}>
            Kolik reálně vyděláš. V korunách.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', fontSize: 21, fontWeight: 600, color: TEAL, backgroundColor: 'rgba(20,184,166,0.12)', padding: '8px 18px', borderRadius: 999 }}>
              v Kč
            </div>
            <div style={{ display: 'flex', fontSize: 21, fontWeight: 600, color: TEAL, backgroundColor: 'rgba(20,184,166,0.12)', padding: '8px 18px', borderRadius: 999 }}>
              po TER
            </div>
            <div style={{ display: 'flex', fontSize: 21, fontWeight: 600, color: TEAL, backgroundColor: 'rgba(20,184,166,0.12)', padding: '8px 18px', borderRadius: 999 }}>
              reálná data
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )
}
