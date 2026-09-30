import { Tooltip } from '../../components/overlays/tooltip/tooltip';
import { prose } from './words';
import './dictionary.css';

export { prose, WORDS } from './words';

/**
 * A token named in prose, "Border Strong", with its true name, `border.strong`, in a Tooltip on hover and focus.
 * A tooltip trigger must be interactive or an image: the name is an image of text whose accessible name holds both forms.
 */
export function TokenName({ name }: { name: string }) {
  const words = prose(name);
  return (
    <Tooltip content={name}>
      <span className="doc-token-name" role="img" aria-label={`${words}, ${name}`} tabIndex={0}>
        {words}
      </span>
    </Tooltip>
  );
}
