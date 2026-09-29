import { useRef, useState, type DragEvent, type ReactNode, type RefObject } from 'react'

/** 25 MB — the ceiling three separate copies of this dropzone already used. */
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export interface DropzoneRejection {
  file: File
  reason: 'size' | 'count'
}

interface DropzoneProps {
  onFiles: (files: File[]) => void
  /** Reported instead of silently dropping the file — the caller shows the message. */
  onReject?: (rejections: DropzoneRejection[]) => void
  accept?: string
  multiple?: boolean
  maxSizeBytes?: number
  /** Counts files already staged, so the ceiling holds across several drops. */
  maxFiles?: number
  currentCount?: number
  disabled?: boolean
  /** « Glisser les fichiers ici » */
  lead: ReactNode
  /** « PDF, JPG ou PNG · 25 Mo maximum » */
  hint?: ReactNode
  className?: string
}

/**
 * Splits a batch into what fits and what does not.
 *
 * `room` counts the slots left *including* files already staged, so the ceiling
 * holds across successive drops rather than only within one.
 */
function partition(files: readonly File[], maxSizeBytes: number, room: number) {
  const accepted: File[] = []
  const rejected: DropzoneRejection[] = []

  for (const file of files) {
    if (file.size > maxSizeBytes) rejected.push({ file, reason: 'size' })
    else if (accepted.length >= room) rejected.push({ file, reason: 'count' })
    else accepted.push(file)
  }

  return { accepted, rejected }
}

/**
 * How many files the zone will still take.
 *
 * `multiple` is an `<input>` attribute and does nothing to a drop, so the
 * ceiling has to carry it: without this, a single-file zone accepts a two-file
 * drag silently.
 */
function roomFor(multiple: boolean, maxFiles: number | undefined, currentCount: number) {
  const ceiling = multiple ? maxFiles : 1
  return ceiling === undefined ? Infinity : ceiling - currentCount
}

/** Validates a batch and hands each half to the caller. */
function deliver(
  list: FileList | null,
  limits: { maxSizeBytes: number; room: number },
  onFiles: (files: File[]) => void,
  onReject?: (rejections: DropzoneRejection[]) => void,
) {
  if (!list || list.length === 0) return

  const { accepted, rejected } = partition(Array.from(list), limits.maxSizeBytes, limits.room)
  if (accepted.length > 0) onFiles(accepted)
  if (rejected.length > 0) onReject?.(rejected)
}

/** Drag-over state plus the three handlers that keep it honest. */
function useDragTarget(disabled: boolean, onDrop: (files: FileList) => void) {
  const [active, setActive] = useState(false)

  const handlers = {
    onDragOver: (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setActive(!disabled)
    },
    onDragLeave: () => setActive(false),
    onDrop: (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setActive(false)
      if (!disabled) onDrop(event.dataTransfer.files)
    },
  }

  return { active, handlers }
}

function HiddenFileInput({
  inputRef,
  accept,
  multiple,
  disabled,
  onPick,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  accept?: string
  multiple: boolean
  disabled: boolean
  onPick: (files: FileList | null) => void
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      className="mo-visually-hidden"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      // Clearing lets the same file be picked twice in a row — otherwise the
      // change event never fires the second time.
      onChange={(event) => {
        onPick(event.target.files)
        event.target.value = ''
      }}
      // The button already carries the click and the label.
      tabIndex={-1}
    />
  )
}

/**
 * The `.mo-dropzone` primitive: drag-and-drop plus a file picker, in one button.
 *
 * The validation lives here on purpose. Five copies of this markup existed, three
 * of them declared the same 25 MB ceiling independently, and the fourth validated
 * nothing at all — so a file that one screen refused, another accepted.
 *
 * The element is a `<button>` wrapping a visually hidden `<input type="file">`:
 * the drop target has to be reachable by keyboard, and a `<div>` with a click
 * handler is not.
 */
export function Dropzone({
  onFiles,
  onReject,
  accept,
  multiple = false,
  maxSizeBytes = MAX_FILE_SIZE_BYTES,
  maxFiles,
  currentCount = 0,
  disabled = false,
  lead,
  hint,
  className,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const room = roomFor(multiple, maxFiles, currentCount)
  const take = (list: FileList | null) => deliver(list, { maxSizeBytes, room }, onFiles, onReject)

  const { active, handlers } = useDragTarget(disabled, take)

  return (
    <button
      type="button"
      className={['mo-dropzone', active && 'is-active', className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      {...handlers}
    >
      <span className="mo-dropzone-lead">{lead}</span>
      {hint !== undefined && <span className="mo-dropzone-hint">{hint}</span>}
      <HiddenFileInput
        inputRef={inputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onPick={take}
      />
    </button>
  )
}
