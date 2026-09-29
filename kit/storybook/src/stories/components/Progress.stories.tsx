import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hud, Track } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Rail & HUD',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Rail & HUD',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Rail & HUD"
      primitive={['Hud', 'Track']}
      summary="Deux primitives, une seule idée : où en est-on. Le rail est la barre nue, qu’on pose n’importe où. Le HUD est l’en-tête composé qui la met en scène — décompte à gauche, barre au centre, référence à droite — en haut d’une modale, d’une page ou d’un panneau où l’utilisateur a besoin du « j’en suis où » d’un coup d’œil."
      usedOn="Track : 6 fichiers · HUD : 2 fichiers"
      anatomy={{
        render: (
          <div style={{ width: 460 }}>
            <Hud eyebrow="Progression" done={3} total={5} unit="lignes prêtes" asideLabel="Réquisition" asideValue="#12345" />
          </div>
        ),
        stageWidth: 580,
        stagePadding: 44,
        parts: [
          { n: 1, label: 'Sur-titre', note: 'ce qui est mesuré', x: '-18px', y: '18px' },
          { n: 2, label: 'Décompte', note: 'fait / total, puis l’unité', x: '-18px', y: '46px' },
          { n: 3, label: 'Rail', note: 'la même primitive Track, sans étiquette', x: '50%', y: 'calc(100% + 18px)' },
          { n: 4, label: 'Référence', note: 'le numéro qu’on cite au téléphone', x: 'calc(100% + 18px)', y: '38px' },
        ],
      }}
      specs={[
        { label: 'Hauteur du rail', value: '4 px · 3 px en size="sm"' },
        { label: 'Rayon du rail', value: '--mo-radius-pill — le seul endroit où il sert' },
        { label: 'Fond du rail', value: '--mo-surface-sunk' },
        { label: 'Remplissage', value: '--mo-primary ; --mo-ready et --mo-error en variantes' },
        { label: 'Transition', value: '--mo-ease-out, 220 ms' },
        { label: 'Écrêtage', value: 'le remplissage est borné à 0–100 %, aria-valuenow reporte la vraie valeur' },
        { label: 'Rôle du rail', value: 'progressbar avec label, sinon presentation' },
        { label: 'Grille du HUD', value: 'trois colonnes — stat, barre, stat' },
      ]}
      tokens={['--mo-surface-sunk', '--mo-primary', '--mo-ready', '--mo-error', '--mo-muted']}
      api={[
        { label: 'Track · value', value: 'Ratio de 0 à 1. Le remplissage est écrêté ; la valeur annoncée ne l’est pas, pour qu’un dépassement de 110 % s’entende.' },
        { label: 'Track · tone', value: '"primary" | "ready" | "error".' },
        { label: 'Track · size', value: '"md" | "sm".' },
        { label: 'Track · label', value: 'Sans lui, la barre reste décorative — le bon choix quand un décompte voisin dit déjà la même chose.' },
        { label: 'Hud · eyebrow, done, total, unit', value: 'Le décompte de gauche : « Progression · 3 / 5 lignes prêtes ».' },
        { label: 'Hud · asideLabel, asideValue', value: 'La stat de droite, en général une référence.' },
      ]}
      states={[
        { render: <div style={{ width: 200 }}><Track value={0} /></div>, label: 'Vide', trigger: 'value={0}' },
        { render: <div style={{ width: 200 }}><Track value={0.42} /></div>, label: 'En cours', trigger: 'value={0.42}' },
        { render: <div style={{ width: 200 }}><Track value={1} tone="ready" /></div>, label: 'Terminé', trigger: 'tone="ready"' },
        { render: <div style={{ width: 200 }}><Track value={1.1} tone="error" /></div>, label: 'Dépassement', trigger: 'value > 1 · tone="error"', note: 'Le remplissage s’arrête à 100 %, aria-valuenow dit 110.' },
        { render: <div style={{ width: 200 }}><Track value={0.42} size="sm" /></div>, label: 'Compact', trigger: 'size="sm"' },
      ]}
      extra={{
        title: 'HUD',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)', maxWidth: 560 }}>
            <Hud eyebrow="Progression" done={0} total={5} unit="lignes prêtes" asideLabel="Réquisition" asideValue="#12345" />
            <Hud eyebrow="Progression" done={3} total={5} unit="lignes prêtes" asideLabel="Réquisition" asideValue="#12345" />
            <Hud eyebrow="Progression" done={5} total={5} unit="lignes prêtes" tone="ready" asideLabel="Réquisition" asideValue="#12345" />
          </div>
        ),
      }}
      rules={{
        do: [
          'Mettre le décompte en chiffres à côté de la barre : « 3 / 5 » se lit, une barre s’estime.',
          'Laisser la barre décorative quand un décompte voisin dit déjà la même chose — sinon un lecteur d’écran l’entend deux fois.',
          'Passer en tone="error" pour un dépassement, et laisser aria-valuenow dire la vraie valeur.',
          'Poser le HUD en haut du panneau, avant le contenu qu’il résume.',
        ],
        dont: [
          'Ne pas employer le rayon pill ailleurs que sur un rail de progression.',
          'Ne pas animer le remplissage sur plus de 220 ms.',
          'Ne pas afficher une barre sans son décompte : une barre seule ne dit ni combien ni sur combien.',
          'Ne pas se servir du HUD pour un état qui n’est pas une progression.',
        ],
      }}
    />
  ),
}
