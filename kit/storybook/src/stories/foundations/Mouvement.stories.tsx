import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { DocPage } from '../docs/DocPage'
import './foundations.css'

const meta = {
  title: 'Fondations/Mouvement',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

const DURATIONS = [
  { token: '--mo-duration-instant', value: '50 ms', usage: 'Pression, coche, couche d’état' },
  { token: '--mo-duration-fast', value: '150 ms', usage: 'Survol, focus, couleur' },
  { token: '--mo-duration-base', value: '200 ms', usage: 'Un composant change d’état' },
  { token: '--mo-duration-slow', value: '300 ms', usage: 'Une surface entre : tiroir, modale, rôtie' },
  { token: '--mo-duration-deliberate', value: '400 ms', usage: 'Pleine fenêtre seulement. Le plafond.' },
]

const CURVES = [
  { token: '--mo-ease-standard', value: 'cubic-bezier(0.2, 0, 0.38, 0.9)', usage: 'Se déplace dans la vue' },
  { token: '--mo-ease-enter', value: 'cubic-bezier(0, 0, 0.38, 0.9)', usage: 'Apparaît — jamais d’accélération au départ' },
  { token: '--mo-ease-exit', value: 'cubic-bezier(0.2, 0, 1, 0.9)', usage: 'Sort — finit à pleine vitesse' },
]

/**
 * Motion is the one foundation a static page cannot show, so every specimen here runs.
 *
 * Replay works by remounting on a key rather than by toggling a class: restarting a CSS
 * animation in place needs a forced reflow, which is the kind of thing that works until
 * someone batches it.
 */
const Stage = ({ children }: { children: (run: number) => ReactNode }) => {
  const [run, setRun] = useState(0)
  const [reduced, setReduced] = useState(false)

  return (
    <div className="mvt">
      <div className="mvt__controls">
        <button type="button" className="mo-btn mo-btn--ghost" onClick={() => setRun((n) => n + 1)}>
          Rejouer
        </button>
        <label className="mvt__toggle">
          <input type="checkbox" checked={reduced} onChange={(event) => setReduced(event.target.checked)} />
          Simuler « mouvement réduit »
        </label>
      </div>
      <div className="mvt__stage" data-reduced={reduced || undefined}>
        {children(run)}
      </div>
    </div>
  )
}

const DurationSpecimens = () => (
  <Stage>
    {(run) => (
      <div className="mvt__rows">
        {DURATIONS.map((duration) => (
          <div className="mvt__row" key={`${duration.token}-${run}`}>
            <code className="fnd__name">{duration.token}</code>
            <div className="mvt__rail">
              <span className="mvt__dot" style={{ animationDuration: `var(${duration.token})` }} />
            </div>
            <span className="mvt__value">{duration.value}</span>
            <span className="fnd__usage">{duration.usage}</span>
          </div>
        ))}
      </div>
    )}
  </Stage>
)

const CurveSpecimens = () => (
  <Stage>
    {(run) => (
      <div className="mvt__rows">
        {CURVES.map((curve) => (
          <div className="mvt__row mvt__row--curve" key={`${curve.token}-${run}`}>
            <code className="fnd__name">{curve.token}</code>
            <div className="mvt__rail">
              <span
                className="mvt__dot"
                style={{ animationDuration: 'var(--mo-duration-deliberate)', animationTimingFunction: `var(${curve.token})` }}
              />
            </div>
            <span className="fnd__usage">{curve.usage}</span>
          </div>
        ))}
        <p className="mvt__note">
          Les trois durent 400 ms. Ce qui change, c’est le profil : une entrée n’accélère pas au
          départ, une sortie ne ralentit pas à l’arrivée.
        </p>
      </div>
    )}
  </Stage>
)

const ReducedMotionSpecimen = () => (
  <Stage>
    {(run) => (
      <div className="mvt__compare">
        <div className="mvt__compareCell">
          <span className="mvt__compareHead">Par défaut</span>
          <div className="mvt__panel mvt__panel--enter" key={`default-${run}`}>
            Le panneau entre par son bord
          </div>
        </div>
        <div className="mvt__compareCell" data-reduced>
          <span className="mvt__compareHead">prefers-reduced-motion: reduce</span>
          <div className="mvt__panel mvt__panel--enter" key={`reduced-${run}`}>
            Le fondu reste, le déplacement tombe à zéro
          </div>
        </div>
      </div>
    )}
  </Stage>
)

export const Mouvement: StoryObj = {
  name: 'Mouvement',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Mouvement"
      summary="Le mouvement n’est pas de l’agrément : c’est le canal qui dit ce qui vient de changer. Un changement sans transient à l’endroit où il se produit passe souvent inaperçu, et un transient ailleurs masque le vrai. On anime donc ce qui a changé, là où ça a changé, et rien d’autre ne bouge. L’échelle est celle sur laquelle Material 3, Carbon, Fluent 2 et Polaris convergent ; 400 ms est un plafond, pas un échelon."
      usedOn="Survol et focus, ouverture de modale et de tiroir, rôties, entrée de ligne, rails de progression"
      specs={[
        ...DURATIONS.map((duration) => ({ label: duration.token, value: `${duration.value} — ${duration.usage}` })),
        ...CURVES.map((curve) => ({ label: curve.token, value: `${curve.value} — ${curve.usage}` })),
        { label: '--mo-motion-shift', value: '8 px — la seule distance de déplacement ; tombe à 0 sous mouvement réduit' },
        { label: 'Entrées partagées', value: 'mo-fade-in, mo-enter-from-right, mo-enter-from-left, mo-enter-from-below' },
        { label: 'Déprécié', value: '--mo-ease (160 ms ease) et --mo-ease-out (220 ms ease-out) : une durée empaquetée dans un jeton nommé pour une courbe' },
      ]}
      extra={[
        { title: 'Les cinq durées', content: <DurationSpecimens /> },
        { title: 'Les trois courbes', content: <CurveSpecimens /> },
        { title: 'Mouvement réduit', content: <ReducedMotionSpecimen /> },
      ]}
      rules={{
        do: [
          'Animer ce qui a changé, à l’endroit où ça a changé : c’est le transient qui fait remarquer le changement.',
          'Prendre la durée dans --mo-duration-* et la courbe dans --mo-ease-*.',
          'Faire entrer une surface par son propre bord, avec --mo-motion-shift.',
          'Animer transform et opacity : le reste force un calcul de mise en page à chaque image.',
          'Accompagner toute animation d’attention d’un message en région live — le mouvement n’annonce rien à un lecteur d’écran.',
          'Couper les boucles sous prefers-reduced-motion avec animation: none.',
        ],
        dont: [
          'Ne pas dépasser 400 ms sur ce que l’utilisateur déclenche : au-delà, la réponse ne se lit plus comme une seule.',
          'Ne pas animer une cible que le pointeur vise déjà — ni rebond, ni dépassement.',
          'Ne pas faire entrer les lignes d’une liste qui se recharge toute seule.',
          'Ne pas animer une donnée : un nombre qui défile cache la valeur qu’on est venu lire.',
          'Ne pas écrire transition: all, ni une durée ou une courbe en clair.',
          'Ne pas mettre de transition sur l’anneau de focus : il est instantané ou il retarde.',
        ],
      }}
    />
  ),
}
