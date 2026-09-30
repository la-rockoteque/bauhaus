import { AUTO_CHECKS, type Check } from './auto-checks';
import { CHECKS as clickables } from './auto-checks-clickables';
import { CHECKS as dataStructures } from './auto-checks-data-structures';
import { CHECKS as feedback } from './auto-checks-feedback';
import { CHECKS as fields } from './auto-checks-fields';
import { CHECKS as navigation } from './auto-checks-navigation';
import { CHECKS as overlays } from './auto-checks-overlays';
import { CHECKS as patterns } from './auto-checks-patterns';

/** Every auto check: the foundations and primitives in auto-checks.ts, plus one file per family. */
export const ALL_CHECKS: Readonly<Record<string, Check>> = {
  ...AUTO_CHECKS, ...clickables, ...fields, ...navigation, ...feedback, ...overlays, ...dataStructures, ...patterns,
};
