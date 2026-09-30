import { Header } from '../doc-page/doc-page';
import { GuideLink } from '../doc-page/sections';
import type { DocPageProps, Rule } from '../doc-page/types';
import { Accessibility, Rulebook } from '../rulebook/rulebook';

export interface AdvisoriesPageProps extends Pick<DocPageProps, 'name' | 'layer' | 'family' | 'guide' | 'guideName'> {
  /** The slice's `<name>.rules.ts` export. */
  rules: readonly Rule[];
}

/** The Advisories page of a slice: the live Rulebook and the Accessibility coverage, beside the Showcase. */
export function AdvisoriesPage({ name, layer, family, rules, guide, guideName }: AdvisoriesPageProps) {
  return (
    <article className="doc">
      <Header name={name} layer={layer} family={family} />
      {rules.length > 0 ? (
        <>
          <Rulebook rules={rules} />
          <Accessibility rules={rules} />
        </>
      ) : (
        <p className="doc-muted">{`${name} has no rules yet.`}</p>
      )}
      <GuideLink guide={guide} guideName={guideName} />
    </article>
  );
}
