---
id: bauhaus/principles
title: The Bauhaus and its principles for a design system
shelf: bauhaus
layer: cross-cutting
owner: design-system-architect
tags: [bauhaus, history, principles, vorkurs, workshops, standardisation, functionalism]
sources:
  - Walter Gropius, "Programm des Staatlichen Bauhauses in Weimar", April 1919 (the founding manifesto)
  - Louis Sullivan, "The Tall Office Building Artistically Considered", Lippincott's Magazine, March 1896
  - Bauhaus-Archiv / Museum für Gestaltung, Berlin — https://www.bauhaus.de/
  - Stiftung Bauhaus Dessau — https://www.bauhaus-dessau.de/
  - Wassily Kandinsky, Punkt und Linie zu Fläche (Point and Line to Plane), Bauhaus book 9, 1926
  - Herbert Bayer, universal typeface design, 1925
---

# The Bauhaus and its principles

> The Bauhaus was a German school of art, craft and architecture. It ran from 1919 to 1933. Its teachers taught everyone the same basics first. Then students worked in workshops where they made real objects for industry. This plugin borrows the method, not the look: teach the basics first, build small reusable parts, keep the whole coherent, and let function decide form.

The plugin is named after the school. The name is a method, not a style. A design system does not have to look "Bauhaus". It has to work the way the school worked: a shared foundation, made parts, and a whole.

## Rules

1. Use the history only as far as it is verifiable. Give a date and a name or say nothing. (A wrong citation costs trust in every other line.)
2. Attribute "form follows function" to Louis Sullivan (1896). Do not credit the Bauhaus with the phrase. (The Bauhaus adopted the idea; the phrase is Sullivan's.)
3. Present the mapped principles as this plugin's design choices, inspired by the school. Do not present them as Bauhaus doctrine. (The school held several, often opposed, positions across its directors.)
4. Never justify a rule by "the Bauhaus said so". Justify it with a criterion, a published system or a research result. (A rule needs a basis; history is context.)

## The school in brief

| Period | Place | Director | Notes |
|---|---|---|---|
| 1919–1925 | Weimar | Walter Gropius | Founded April 1919 by merging the Weimar art academy and the school of arts and crafts. Manifesto: "The ultimate aim of all creative activity is the building." |
| 1925–1932 | Dessau | Gropius until 1928; Hannes Meyer 1928–1930; Ludwig Mies van der Rohe from 1930 | Moved after political pressure in Weimar. Gropius designed the Dessau building (opened 1926). Emphasis moved toward design for industry. |
| 1932–1933 | Berlin | Mies van der Rohe | A private school in a former factory. Closed by its faculty in July 1933 under Nazi pressure. |

Source for dates and directors: Bauhaus-Archiv and Stiftung Bauhaus Dessau.

## People and what they contributed

Only facts that the sources above support.

| Person | Role at the Bauhaus | Contribution relevant here |
|---|---|---|
| **Walter Gropius** | Founder and first director | The 1919 manifesto; the workshop model; the aim of uniting art and craft. The 1923 exhibition slogan "Art and Technology: A New Unity". |
| **Johannes Itten** | Teacher from 1919; left 1923 | Created the *Vorkurs*, the preliminary course taken by every student. |
| **László Moholy-Nagy** | Teacher 1923–1928 | Took over the Vorkurs (with Josef Albers) after Itten; stressed technology, photography, typography. |
| **Josef Albers** | Student, then teacher | Taught the Vorkurs from 1923; studied material and colour relations. |
| **Wassily Kandinsky** | Teacher from 1922 | Taught form and colour theory; wrote *Point and Line to Plane* (1926). |
| **Paul Klee** | Teacher from 1921 | Taught form theory and design principles. |
| **Herbert Bayer** | Student, then master of the printing and advertising workshop, 1925–1928 | Designed a "universal" lowercase sans-serif alphabet (1925): one reduced set of shapes for all print. |
| **Marianne Brandt** | Student in the metal workshop, later its head (1928–1929) | Designed lamps and tea and coffee wares reworked for industrial production. |
| **Anni Albers** | Student, then a weaver in the weaving workshop | Textile work that treated material and structure as design. Gunta Stölzl led the workshop 1927–1931. |
| **Ludwig Mies van der Rohe** | Last director, 1930–1933 | Architecture of reduced means. He used "less is more"; the phrase appears earlier in Robert Browning's poem "Andrea del Sarto" (1855). |

## Ideas and their mapping

### Form follows function

The phrase comes from the American architect Louis Sullivan. In his 1896 essay he wrote that "form ever follows function". Modernists, including many at the Bauhaus, adopted the idea. The school never used it as an official slogan. Hannes Meyer, director 1928–1930, held the most strictly functional position.

For a design system: a component exists because it does a job. Its shape follows that job. A button that needs ornament to read is the wrong button.

### Unity of art and craft, and the workshop model

The 1919 manifesto called for a new guild of craftspeople, without the class line between artist and craftsperson. Students learned in workshops (metal, weaving, wood, print, wall painting). Each workshop had a master of form and a master of craft.

For a design system: components are made, not decreed. The people who build a component must own both its look and its code. A designer alone or a developer alone gives a weaker part. The design-system-architect and the maker of a component share the work.

### The Vorkurs

Itten created the Vorkurs (preliminary course) at Weimar. Every student took it before entering a workshop. It taught materials, form, colour and composition, without a product to make. Albers and Moholy-Nagy carried it on after 1923.

For a design system: the foundations are the Vorkurs. Everyone learns colour, type, spacing and motion rules first, before they build a screen. No one enters a workshop (builds a component or a pattern) without the shared basics.

### A small set of primary forms and colours

Kandinsky asked in 1923 whether the three primary forms, triangle, square and circle, matched the three primary colours, yellow, red and blue. He proposed the pairing yellow-triangle, red-square, blue-circle and asked students to test it. The answers were not unanimous. Treat it as a teaching question, not a finding.

For a design system: a small, reasoned set beats a large, arbitrary one. Choose few forms and hues, and give each a reason. The scale is closed. This is a design choice supported by system practice. It is not a claim that Kandinsky's pairing is true.

### Gesamtkunstwerk

The word is Richard Wagner's (1849), meaning a total work of art. The 1919 manifesto sets "the building" as the aim in which all crafts unite.

For a design system: the whole must cohere. Tokens, components, patterns, styleguide, Storybook and rulebook are one work. A part that breaks the whole is a defect, even if it looks good alone.

### Standardisation for industry

From about 1923 the school moved toward designing prototypes for series production. The 1923 exhibition took the slogan "Art and Technology: A New Unity". Bauhaus workshops produced standard types (*Typen*), for instance furniture types, lamps and wallpaper, meant to be reproduced.

For a design system: components are standard types. Design one good button and reproduce it everywhere. Variation happens through parameters (props, tokens), not through new one-offs.

### Less is more

Mies van der Rohe, last director, is associated with the phrase. It is older than him (Browning, 1855). He adopted it as a statement about reduced means and clarity.

For a design system: prefer the smallest system that does the job. Every new token, component or rule has a cost in docs, tests and learning. Delete before you add.

## The plugin's principles

Derived from the ideas above. Each has a basis in a system practice, a standard or the source guide, not in the school's authority.

| # | Principle | From | Basis for the rule |
|---|---|---|---|
| 1 | **Function decides form.** Every part exists for a job that can be stated in one sentence. | Form follows function | One-job gate: [contribution](../governance/contribution.md). |
| 2 | **Teach the foundations first.** Foundations are written, closed and read before any component is built. | The Vorkurs | Layer order in [../taxonomy/layers.md](../taxonomy/layers.md): foundation defines the scale tokens populate. |
| 3 | **Make small, reusable parts.** A component has one job and appears at least twice. | Standardisation; workshops | Three gates: [contribution](../governance/contribution.md). |
| 4 | **Keep the set small and reasoned.** A closed scale, few hues, few radii, two elevation rungs. | Primary forms and colours; less is more | Closed scales: [colour](../foundations/color.md). |
| 5 | **Constrain to cohere.** Tokens are the only source of a raw value. | Gesamtkunstwerk | [../taxonomy/layers.md](../taxonomy/layers.md) rule 3. |
| 6 | **Makers own the whole part.** Look, code, states and accessibility belong to one owner per component. | Unity of art and craft | Four artifacts ship together ([../governance/contribution.md](../governance/contribution.md)). |
| 7 | **Design for reproduction.** Vary by props and tokens, not by copies. | Standardisation for industry | Adoption and token-coverage metrics ([../governance/metrics.md](../governance/metrics.md)). |
| 8 | **Show the reason.** Every rule carries a basis: a criterion with its level, a published system or a research result. | Teaching by principle, not taste | Architecture contract: a finding with no basis is an opinion. |
| 9 | **Delete before you add.** Each addition has a cost; closing an advisory is deleting it. | Less is more | Advisory rule: closing means deleting ([../governance/rulebook.md](../governance/rulebook.md)). |
| 10 | **Explain in plain words first.** The whole team must be able to use the system. | The school taught everyone, not only specialists | [../taxonomy/plain-language.md](../taxonomy/plain-language.md); WCAG 3.1.5 (AAA) reading level as a reference point for plain text. |

## Rulebook seeds

- `bauhaus.one-job` · review · MEDIUM · Each component states its job in one sentence.
- `bauhaus.closed-scale` · review · MEDIUM · Each foundation states that its scale is closed.
- `bauhaus.basis-cited` · review · MEDIUM · Each rule cites a basis, not an authority.

## Misfiles

- "Bauhaus style" as a visual brief (primary colours, geometric shapes). The plugin borrows method, not aesthetics.
- History used as a basis for a rule. Cite a criterion or a system.
- "Form follows function" credited to Gropius. It is Sullivan's phrase.

## See also

- [../taxonomy/layers.md](../taxonomy/layers.md) — the foundation as the Vorkurs; the component as the standard type.
- [../taxonomy/plain-language.md](../taxonomy/plain-language.md) — principle 10 in practice.
- [../governance/contribution.md](../governance/contribution.md) — the workshop model as a review flow.
- [../governance/maturity.md](../governance/maturity.md) — how far a project has come.
