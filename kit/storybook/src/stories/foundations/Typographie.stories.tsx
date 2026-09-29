import type { Meta, StoryObj } from '@storybook/react-vite'
import { requisitionRef } from '../../utils/entityRefs'
import { DocPage } from '../docs/DocPage'
import { RAMP } from './tokenSpecimens'
import './foundations.css'

const meta = {
  title: 'Fondations/Typographie',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Typographie: StoryObj = {
  name: 'Typographie',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Typographie"
      summary="Une famille, deux voix. IBM Plex Sans porte tout ce qui se lit en prose — titres, libellés, boutons, en-têtes de tableau. IBM Plex Mono porte tout ce qui s’aligne en colonne ou s’épelle : numéros de réquisition, numéros de série, codes scannés, quantités. Le partage n’est pas esthétique : le monospace garantit que les chiffres d’une colonne s’empilent au caractère près."
      usedOn="Toutes les pages · polices chargées dans index.html"
      anatomy={{
        render: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 340 }}>
            <span className="mo-kicker">Réquisition</span>
            <span style={{ fontSize: 'var(--mo-text-2xl)', fontWeight: 600, letterSpacing: '-0.018em', color: 'var(--mo-ink)' }}>
              Préparation des outils
            </span>
            <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink-soft)' }}>
              {requisitionRef(12345)}
            </span>
          </div>
        ),
        stageWidth: 480,
        parts: [
          { n: 1, label: 'Sur-titre', note: 'sentence case, jamais de majuscules étirées', x: 'calc(100% + 18px)', y: '10px' },
          { n: 2, label: 'Titre de page', note: '--mo-text-2xl, semibold, interlettrage -0,018em', x: 'calc(100% + 18px)', y: '44px' },
          { n: 3, label: 'Identifiant', note: 'monospace — il s’épelle, il ne se lit pas', x: 'calc(100% + 18px)', y: '82px' },
          { n: 4, label: 'Interligne', note: 'toujours pris dans --mo-lh-*', x: '-18px', y: '50%' },
        ],
      }}
      specs={[
        { label: 'Famille d’interface', value: 'IBM Plex Sans — 400, 500, 600' },
        { label: 'Famille technique', value: 'IBM Plex Mono — 400, 500, 600' },
        { label: 'Chargement', value: 'Google Fonts, lien dans index.html (et .storybook/preview-head.html)' },
        { label: 'Échelle', value: 'xs 11 · sm 12,5 · md 14 · lg 16 · xl 20 · 2xl 26 px' },
        { label: 'Interlignes', value: 'tight 1,25 · snug 1,4 · normal 1,55' },
        { label: 'Graisses', value: 'regular 400 · medium 500 · semibold 600 — trois échelons, pas quatre' },
        { label: 'Alias legacy', value: '--mo-font-display pointe sur --mo-font-body ; ne pas s’en servir dans du code neuf' },
      ]}
      extra={{
        title: 'Échelle complète',
        content: (
          <div className="fnd__ramp">
            {RAMP.map(([token, spec, sample, style], i) => (
              <div className="fnd__rampRow" key={`${token}-${i}`}>
                <div className="fnd__rampSpec">
                  <code className="fnd__name">{token}</code>
                  <span className="fnd__usage">{spec}</span>
                </div>
                <div className="fnd__rampSample" style={style}>
                  {sample}
                </div>
              </div>
            ))}
          </div>
        ),
      }}
      rules={{
        do: [
          'Passer en monospace dès qu’une valeur s’épelle ou s’aligne en colonne : identifiant, numéro de série, quantité, pourcentage.',
          'Prendre la taille dans l’échelle et l’interligne dans --mo-lh-*, à chaque fois.',
          'Différencier par la couleur, puis la taille, puis la graisse — dans cet ordre.',
          'Garder les sur-titres en sentence case : le système n’a pas de style « libellé en majuscules ».',
        ],
        dont: [
          'Ne pas introduire une troisième famille ni une graisse 700.',
          'Ne pas mettre en monospace un nom, une description ou une adresse — ça se lit, ça ne s’aligne pas.',
          'Ne pas employer les majuscules avec interlettrage étiré comme style de libellé.',
          'Ne pas fabriquer une taille intermédiaire hors de l’échelle.',
        ],
      }}
    />
  ),
}

/* ------------------------------------------------------------------ */
/* Espacement & rayons                                                 */
/* ------------------------------------------------------------------ */
