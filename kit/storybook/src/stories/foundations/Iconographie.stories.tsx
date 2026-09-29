import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Info,
  Package,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Truck,
  Upload,
  Wrench,
  X,
} from 'lucide-react'
import './foundations.css'
import './iconographie.css'

/**
 * The icon layer, as it actually stands.
 *
 * Written from a survey of the source rather than from intent, because intent was never
 * written down: the counts below were measured on 2026-09-21 by grepping `src/`, and the
 * drift they show — nine sizes, three stroke widths, two icon systems — is the finding,
 * not a rendering of a spec. Re-measure before trusting a number here:
 *
 *     grep -rho "size={[0-9]*}" src/ | sort | uniq -c | sort -rn
 *     grep -rho "strokeWidth={[0-9.]*}" src/ | sort | uniq -c
 */
const meta = {
  title: 'Fondations/Iconographie',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

/** Measured 2026-09-21. See the module docstring for the command. */
const SIZES = [
  { px: 16, uses: 29, role: 'Le défaut. Bouton, en-tête de tableau, ligne de liste.' },
  { px: 14, uses: 25, role: 'Dense — dans une ligne de tableau, un tag, une pastille.' },
  { px: 18, uses: 6, role: 'Accent — une action isolée, un état vide.' },
  { px: 15, uses: 7, role: 'Sans rôle : un pas entre 14 et 16 que rien ne justifie.' },
  { px: 13, uses: 4, role: 'Sans rôle.' },
  { px: 11, uses: 5, role: 'Sans rôle — sous le seuil de lisibilité d’un glyphe stroké.' },
  { px: 12, uses: 1, role: 'Sans rôle.' },
  { px: 17, uses: 1, role: 'Sans rôle.' },
  { px: 20, uses: 1, role: 'Sans rôle.' },
]

const STROKES = [
  { width: 1.5, uses: 11, note: 'Le plus employé, et le plus léger.' },
  { width: 2, uses: 8, note: 'Le défaut de lucide.' },
  { width: 2.25, uses: 8, note: 'Plus lourd que le défaut, sans raison écrite.' },
]

const VOCABULARY = [
  { icon: Truck, name: 'Truck', means: 'Expédition' },
  { icon: Package, name: 'Package', means: 'Matériel, colis' },
  { icon: Wrench, name: 'Wrench', means: 'Outillage' },
  { icon: Check, name: 'Check', means: 'Prêt, confirmé' },
  { icon: AlertTriangle, name: 'AlertTriangle', means: 'Avertissement' },
  { icon: X, name: 'X', means: 'Fermer, retirer' },
  { icon: Trash2, name: 'Trash2', means: 'Supprimer' },
  { icon: Search, name: 'Search', means: 'Rechercher' },
  { icon: Settings, name: 'Settings', means: 'Réglages' },
  { icon: Download, name: 'Download', means: 'Exporter' },
  { icon: Upload, name: 'Upload', means: 'Importer' },
  { icon: ExternalLink, name: 'ExternalLink', means: 'Ouvre un autre système' },
  { icon: ChevronDown, name: 'ChevronDown', means: 'Déplier' },
  { icon: ArrowUpDown, name: 'ArrowUpDown', means: 'Trier' },
  { icon: Info, name: 'Info', means: 'Aide, précision' },
  { icon: Sparkles, name: 'Sparkles', means: 'Assistant, suggestion' },
]

export const Iconographie: StoryObj = {
  name: 'Iconographie',
  render: () => (
    <div className="fnd">
      <p className="doc__eyebrow">MoShip · Système de design</p>
      <h1 className="fnd-title">Iconographie</h1>
      <p className="fnd-lede">
        La bibliothèque est <strong>lucide-react</strong>, employée à 44 endroits, 57
        glyphes distincts. Rien d’autre n’est à dessiner : un besoin d’icône se règle en
        important celle de lucide qui porte déjà le sens.
      </p>

      <section className="ico-section">
        <h2 className="ico-h2">Vocabulaire</h2>
        <p className="ico-note">
          Une icône vaut un sens, et le même sens garde la même icône partout —
          c’est la seule règle qui rende une icône lisible sans son libellé. Les
          associations en service :
        </p>
        <ul className="ico-grid">
          {VOCABULARY.map(({ icon: Icon, name, means }) => (
            <li key={name} className="ico-cell">
              <Icon size={16} aria-hidden="true" />
              <span className="ico-cell__means">{means}</span>
              <code className="ico-cell__name">{name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="ico-section">
        <h2 className="ico-h2">Tailles</h2>
        <p className="ico-note">
          Trois tailles portent un rôle ; six autres sont des accidents. Un nouvel appel
          prend 16, ou 14 dans une rangée dense — et rien d’autre tant qu’une échelle n’est
          pas posée en jetons.
        </p>
        <table className="ico-table">
          <thead>
            <tr>
              <th scope="col">Taille</th>
              <th scope="col">Aperçu</th>
              <th scope="col">Appels</th>
              <th scope="col">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map(({ px, uses, role }) => (
              <tr key={px}>
                <td>
                  <code>{px}</code>
                </td>
                <td>
                  <Package size={px} aria-hidden="true" />
                </td>
                <td>{uses}</td>
                <td>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ico-section">
        <h2 className="ico-h2">Épaisseur de trait</h2>
        <p className="ico-note">
          Trois épaisseurs coexistent sans qu’aucune soit écrite quelque part. Le défaut de
          lucide est 2 ; c’est 1,5 qui est le plus employé ici. À trancher, puis à poser en
          jeton — une icône plus fine que sa voisine, à la même taille, se lit comme une
          erreur d’alignement.
        </p>
        <ul className="ico-strokes">
          {STROKES.map(({ width, uses, note }) => (
            <li key={width} className="ico-stroke">
              <Wrench size={18} strokeWidth={width} aria-hidden="true" />
              <code>{width}</code>
              <span>
                {uses}
                {' appels · '}
                {note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ico-section">
        <h2 className="ico-h2">Accessibilité</h2>
        <ul className="ico-rules">
          <li>
            Une icône <strong>décorative</strong> — doublée par un libellé juste à côté —
            porte <code>aria-hidden=&quot;true&quot;</code>. Sinon un lecteur d’écran
            annonce le nom du glyphe en plus du mot, et le mot est dit deux fois.
          </li>
          <li>
            Une icône <strong>seule dans un contrôle</strong> est le seul nom de ce
            contrôle : le bouton porte un <code>aria-label</code>. C’est ce que{' '}
            <code>IconButton</code> exige, et c’est la règle{' '}
            <code>icon-button.accessible-name</code> du barème.
          </li>
          <li>
            Une icône ne porte <strong>jamais seule</strong> un statut : la couleur et la
            forme se perdent en niveaux de gris comme en vision déficiente (WCAG 1.4.1, A).
            L’icône accompagne le mot, elle ne le remplace pas.
          </li>
          <li>
            Une icône n’est pas une cible. Le contrôle autour d’elle l’est, et c’est lui
            qui doit mesurer 44 × 44 px — le standard maison, que WCAG place au niveau AAA
            (2.5.5) ; AA (2.5.8) n’exige que 24 × 24.
          </li>
        </ul>
      </section>

      <section className="ico-section">
        <h2 className="ico-h2">La dette : deux systèmes</h2>
        <p className="ico-note">
          <code>src/components/Icons/index.tsx</code> tient 15 glyphes dessinés à la main,
          dans un cadre 24 px non surchargeable, employés à <strong>2 endroits</strong>.
          Quatorze des quinze doublent une icône lucide déjà en service ailleurs —{' '}
          <code>TruckIcon</code> contre <code>Truck</code>, <code>GearIcon</code> contre{' '}
          <code>Settings</code>, <code>CloseIcon</code> contre <code>X</code>. C’est un
          fork à refermer dans le sens de lucide : deux appels à migrer, un fichier à
          supprimer. Rien de neuf ne l’importe.
        </p>
      </section>
    </div>
  ),
}
