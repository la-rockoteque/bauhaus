import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FormCheckbox,
  FormChoiceField,
  FormDatePicker,
  FormField,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from '../../components/Form'
import { LegacyPage } from './LegacyPage'

/**
 * TM-94 — the `Form*` family, moved out of Composants.
 *
 * It sat under `Composants/Champs` since TM-51, which was true of what it shows
 * and wrong about what it is: every one of these fourteen components is styled
 * with `--color-*` and `--form-*`. Leaving it there put the two vocabularies in
 * one tree and made the legacy half look like the house style.
 *
 * It keeps its anatomy, states and rules — the accessibility wiring documented
 * here is the reason to reach for these components, not a historical note — and
 * gains the derived debt table every Hérité page carries. The design system's own
 * field classes are now next door under `Composants/Champs/Primitives de champ`;
 * ADR-0032 § « Les champs sont un cas à part » is why both pages exist.
 */
const meta = {
  title: 'Composants/Champs/Champs legacy',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Sample() {
  const [method, setMethod] = useState<'pickup' | 'shipping' | null>('pickup')
  const [notify, setNotify] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)', width: 360 }}>
      <FormField id="preparedBy" label="Préparé par" required defaultValue="Alice Tremblay" />
      <FormField
        id="serial"
        label="Numéro de série"
        hint="Tel qu’il est gravé sur la plaque, sans espace."
        defaultValue="TE30-88421"
      />
      <FormSelect
        id="warehouse"
        label="Entrepôt"
        placeholder="Choisir un entrepôt"
        options={[
          { value: 'qc', label: 'Québec' },
          { value: 'mtl', label: 'Montréal' },
        ]}
        defaultValue="qc"
      />
      <FormDatePicker id="requiredDate" label="Date requise" defaultValue="2026-08-05" />
      <FormChoiceField
        id="deliveryMethod"
        label="Mode de livraison"
        hint="La cueillette se fait au comptoir de l’entrepôt."
        options={[
          { value: 'pickup', label: 'Cueillette' },
          { value: 'shipping', label: 'Expédition' },
        ]}
        value={method}
        onChange={setMethod}
      />
      <FormTextarea id="notes" label="Remarques" rows={3} defaultValue="" />
      <FormCheckbox
        id="urgent"
        label="Traiter en priorité"
        description="La réquisition remonte en tête de la file de préparation."
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mo-space-2)' }}>
        <FormSwitch checked={notify} onCheckedChange={setNotify} label="Notifier le demandeur" />
        <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-ink-soft)' }}>
          Notifier le demandeur
        </span>
      </div>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Champs legacy',
  render: () => (
    <LegacyPage
      name="Champs de formulaire"
      prefixes={['src/components/Form/']}
      summary="Quatorze composants React, tous habillés au jeu legacy — et pourtant ce sont eux qu’il faut employer. C’est là que vit le câblage d’accessibilité : aria-describedby qui pointe sur le message réellement rendu, aria-invalid, role=alert sur l’erreur, l’astérisque du requis. Les primitives .mo-field / .mo-input du système de design n’en portent aucun. Tant que les deux n’ont pas convergé, l’accessibilité pèse plus lourd que la cohérence des jetons."
      usedOn="Réquisitions, admin, gabarits SSE · FormField dans 9 fichiers"
      anatomy={{
        render: (
          <div style={{ width: 300 }}>
            <FormField
              id="anatomy"
              label="Numéro de série"
              required
              hint="Tel qu’il est gravé sur la plaque, sans espace."
              defaultValue="TE30-88421"
            />
          </div>
        ),
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Libellé', note: '--mo-text-sm, weight 500', x: '-18px', y: '8px' },
          { n: 2, label: 'Marque de requis', note: 'astérisque, couleur d’erreur', x: 'calc(100% + 18px)', y: '8px' },
          { n: 3, label: 'Champ', note: '40 px de haut, rayon 6 px', x: '-18px', y: '44px' },
          { n: 4, label: 'Indication', note: 'liée par aria-describedby ; l’erreur prend sa place', x: '-18px', y: 'calc(100% - 6px)' },
        ],
      }}
      specs={[
        { label: 'Hauteur', value: '40 px — --form-input-height' },
        { label: 'Rayon', value: '6 px — --form-input-border-radius' },
        { label: 'Libellé', value: '--form-label-font-size, 0,875 rem, weight 500' },
        { label: 'Indication', value: '--mo-text-xs sur --mo-muted' },
        { label: 'Contraste de l’indication', value: '--mo-muted et non --mo-mute-soft : le second mesure 3,02:1, sous le seuil AA de 4,5:1' },
        { label: 'Focus', value: 'bordure --form-focus-color + anneau de 3 px' },
        { label: 'Erreur', value: 'bordure rouge, message en role="alert", aria-invalid' },
        { label: 'Description', value: 'aria-describedby pointe sur le message rendu — l’erreur, sinon l’indication' },
        { label: 'Mobile', value: 'les contrôles passent à 16 px sous 768 px, pour empêcher le zoom iOS' },
      ]}
      api={[
        { label: 'FormField', value: 'label, error?, required?, hint?, aiFilled? — plus tous les attributs de <input>. Avec forwardRef, pour react-hook-form.' },
        { label: 'FormTextarea', value: 'Même contrat, sur <textarea>.' },
        { label: 'FormSelect', value: 'options ou groups, placeholder?, error?, required?.' },
        { label: 'FormCheckbox', value: 'label, description?, error?.' },
        { label: 'FormDatePicker', value: 'label, error?, required?, aiFilled? — <input type="date"> natif.' },
        { label: 'FormChoiceField', value: 'Groupe de radios segmenté. value peut être null : un choix requis que personne n’a fait.' },
        { label: 'FormSwitch', value: 'role="switch" pour une cellule de matrice, sans libellé visible. disabledReason verrouille ET dit pourquoi.' },
        { label: 'aiFilled', value: 'Marque le champ pré-rempli par l’assistant, jusqu’à ce qu’on y touche.' },
      ]}
      states={[
        { render: <div style={{ width: 240 }}><FormField id="s1" label="Préparé par" defaultValue="Alice Tremblay" /></div>, label: 'Rempli', trigger: 'value' },
        { render: <div style={{ width: 240 }}><FormField id="s2" label="Préparé par" placeholder="Nom du préparateur" /></div>, label: 'Vide', trigger: 'placeholder' },
        { render: <div style={{ width: 240 }}><FormField id="s3" label="Préparé par" required /></div>, label: 'Requis', trigger: 'required' },
        { render: <div style={{ width: 240 }}><FormField id="s4" label="Quantité" hint="Entier, sans unité." /></div>, label: 'Avec indication', trigger: 'hint' },
        { render: <div style={{ width: 240 }}><FormField id="s5" label="Quantité" error="La quantité dépasse le restant." defaultValue="9" /></div>, label: 'En erreur', trigger: 'error', note: 'L’erreur prend la place de l’indication, et aria-describedby la suit.' },
        { render: <div style={{ width: 240 }}><FormField id="s6" label="Préparé par" disabled defaultValue="Alice Tremblay" /></div>, label: 'Désactivé', trigger: 'disabled' },
        { render: <div style={{ width: 240 }}><FormSwitch checked onCheckedChange={() => {}} label="Notifier" /></div>, label: 'Interrupteur actif', trigger: 'checked' },
        { render: <div style={{ width: 240 }}><FormSwitch checked={false} onCheckedChange={() => {}} label="Notifier" disabledReason="Toujours actif pour les mentions." /></div>, label: 'Interrupteur verrouillé', trigger: 'disabledReason', note: 'aria-disabled et non disabled : la case reste atteignable, donc la raison s’entend.' },
      ]}
      caveat={
        <p className="inv__groupNote">
          <strong>Cette famille est l’exception d’ADR-0032.</strong> Ailleurs, un jeton legacy est
          de la dette à reprendre au passage. Ici il ne l’est pas encore : repeindre{' '}
          <code>Form*</code> en <code>--mo-*</code> ferait croire le problème réglé alors que le
          vrai travail est de n’avoir qu’un seul chemin. Le tableau ci-dessous mesure donc l’écart,
          il ne commande pas une reprise fichier par fichier.
        </p>
      }
      target={
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
          <p>
            <strong>Rien, pour l’instant — et c’est une décision, pas un oubli.</strong> Le dépôt
            porte deux façons de faire un champ. Les composants <code>Form*</code> ci-dessus
            s’appuient sur le jeu legacy et portent tout le câblage d’accessibilité. Les primitives{' '}
            <code>.mo-field</code> / <code>.mo-input</code> s’écrivent à la main dans le JSX et n’en
            portent aucun — voir <em>Composants / Champs / Primitives de champ</em>.
          </p>
          <p>
            En usage réel : <code>.mo-input</code> dans 27 fichiers, <code>.mo-field</code> dans 14,
            contre 9 pour <code>&lt;FormField&gt;</code>. Les primitives ont gagné en surface, les
            composants tiennent l’accessibilité. <strong>Aucune des deux n’est simplement « la legacy »</strong>,
            et c’est pourquoi <code>src/components/ui/</code> n’expose volontairement ni{' '}
            <code>Field</code> ni <code>Input</code> : une troisième façon avant d’avoir tranché
            entre les deux premières ne ferait qu’élargir l’écart.
          </p>
          <p>
            <strong>En attendant, du code neuf emploie <code>Form*</code>.</strong> La convergence —
            porter ces composants sur les jetons <code>--mo-*</code>, puis en faire le seul chemin —
            est une story à écrire, pas un effet de bord d’une autre.
          </p>
        </div>
      }
      specimen={{ title: 'Dans un formulaire', content: (
<Sample />
        ) }}
      rules={{
        do: [
          'Passer par les composants Form* plutôt que par mo-field et mo-input dans du code neuf : le câblage d’accessibilité vient avec.',
          'Donner un id à chaque champ — c’est lui qui relie le libellé, l’indication et l’erreur.',
          'Mettre dans hint la grammaire ou le format que le placeholder ne peut pas porter.',
          'Employer disabledReason plutôt que disabled sur un interrupteur verrouillé, pour que la raison reste audible.',
        ],
        dont: [
          'Ne pas composer un champ à la main avec mo-field et mo-input dans du code neuf.',
          'Ne pas faire porter au placeholder le rôle du libellé : il disparaît à la saisie.',
          'Ne pas afficher l’indication et l’erreur en même temps — l’erreur prend la place.',
          'Ne pas employer --mo-mute-soft pour du texte d’aide : 3,02:1, sous le seuil AA.',
        ],
      }}
    />
  ),
}
