import { DocsContainer } from '@storybook/addon-docs/blocks';
import { MDXProvider } from '@storybook/addon-docs/mdx-react-shim';
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { Text } from '../primitives/text/text';
import { ThemeSwitch } from './doc-page/theme-switch';

/**
 * The container of every guide page (`<name>.mdx`).
 *
 * Storybook's own docs theme styles MDX by default. Here every MDX element is mapped to the
 * library's Text primitive or a plain element that `doc-page.css` lays out with tokens, so the
 * guide reads in the design system's type and colour and follows the light and dark toolbar.
 */
type Props = ComponentProps<'p'>;

const heading = (as: ElementType, className: string) =>
  function Heading({ children, id }: Props) {
    return (
      <Text variant="heading" as={as} className={className} id={id}>
        {children}
      </Text>
    );
  };

const H3 = ({ children, id }: Props) => (
  <Text as="h3" className="doc-h3" id={id}>
    {children}
  </Text>
);

const P = ({ children }: Props) => <Text as="p">{children}</Text>;
const Table = ({ children }: ComponentProps<'table'>) => <table className="doc-table">{children}</table>;
const Pre = ({ children }: ComponentProps<'pre'>) => <pre className="doc-guide-pre">{children}</pre>;

export const GUIDE_COMPONENTS = {
  h1: heading('h1', 'doc-h1'),
  h2: heading('h2', 'doc-h2'),
  h3: H3,
  h4: H3,
  p: P,
  table: Table,
  pre: Pre,
};

export function GuideContainer({ children, ...rest }: ComponentProps<typeof DocsContainer>): ReactNode {
  return (
    <DocsContainer {...rest}>
      <MDXProvider components={GUIDE_COMPONENTS}>
        <div className="doc-guide-page sb-unstyled">
          <div className="doc-guide-bar">
            <ThemeSwitch />
          </div>
          {children}
        </div>
      </MDXProvider>
    </DocsContainer>
  );
}
