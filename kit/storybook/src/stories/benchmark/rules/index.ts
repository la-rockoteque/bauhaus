import type { Rule } from '../types'
import { banner } from './Banner'
import { breadcrumb } from './Breadcrumb'
import { button } from './Button'
import { card } from './Card'
import { chip } from './Chip'
import { countBadge } from './CountBadge'
import { dataTable } from './DataTable'
import { dialog } from './Dialog'
import { disclosure } from './Disclosure'
import { commentInput } from './CommentInput'
import { threadPanel } from './ThreadPanel'
import { dropzone } from './Dropzone'
import { emptyState } from './EmptyState'
import { filterBar } from './FilterBar'
import { hud } from './Hud'
import { iconButton } from './IconButton'
import { kicker } from './Kicker'
import { listCard } from './ListCard'
import { loadingOverlay } from './LoadingOverlay'
import { pageHeader } from './PageHeader'
import { pageTitle } from './PageTitle'
import { pager } from './Pager'
import { provenanceBadge } from './ProvenanceBadge'
import { scopeSelector } from './ScopeSelector'
import { sectionHead } from './SectionHead'
import { sideList } from './SideList'
import { skeleton } from './Skeleton'
import { spinner } from './Spinner'
import { spreadsheetGrid } from './SpreadsheetGrid'
import { summaryRail } from './SummaryRail'
import { tag } from './Tag'
import { tabs } from './Tabs'
import { track } from './Track'
import { wizard } from './Wizard'

/**
 * The benchmark: every expectation the design system's primitives are held to.
 *
 * One file per component, so adding a primitive's rules never touches another's.
 */
export const ALL_RULES: readonly Rule[] = [
  ...banner,
  ...breadcrumb,
  ...button,
  ...card,
  ...chip,
  ...countBadge,
  ...dataTable,
  ...dialog,
  ...disclosure,
  ...commentInput,
  ...threadPanel,
  ...dropzone,
  ...emptyState,
  ...filterBar,
  ...hud,
  ...iconButton,
  ...kicker,
  ...listCard,
  ...loadingOverlay,
  ...pageHeader,
  ...pageTitle,
  ...pager,
  ...provenanceBadge,
  ...scopeSelector,
  ...sectionHead,
  ...sideList,
  ...skeleton,
  ...spinner,
  ...spreadsheetGrid,
  ...summaryRail,
  ...tag,
  ...tabs,
  ...track,
  ...wizard,
]

/** The rules grading one primitive, as `components/ui/` names it. */
export const rulesFor = (component: string): Rule[] =>
  ALL_RULES.filter((rule) => rule.component === component)

/** Every primitive the benchmark currently grades. */
export const GRADED: readonly string[] = [...new Set(ALL_RULES.map((rule) => rule.component))].sort()
