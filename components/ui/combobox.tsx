"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

export type ComboboxOption = { value: string; label: string; description?: string }

/**
 * Searchable single-select dropdown, built on @base-ui/react's Combobox
 * primitive (the same library components/ui/select.tsx and input.tsx wrap).
 * Filtering is handled internally by the primitive via the `items` prop —
 * no hand-rolled substring matching needed. When options carry a
 * `description` (e.g. a customer's email under their name), it's shown as a
 * subtitle in the dropdown and included in the search match.
 *
 * Keeps the app's existing error-styling convention (className-driven
 * `border-error-brand` vs `border-hairline-strong`) rather than shadcn's
 * `aria-invalid` styling, to match every other field in the app.
 */
function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  error = false,
  loading = false,
  disabled = false,
  className,
  id,
}: {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
  id?: string
}) {
  const isDisabled = disabled || loading
  const selected = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  )
  const hasDescriptions = options.some((o) => o.description)

  const filter = React.useCallback(
    (option: ComboboxOption, query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        option.label.toLowerCase().includes(q) ||
        (option.description?.toLowerCase().includes(q) ?? false)
      )
    },
    []
  )

  return (
    <ComboboxPrimitive.Root
      items={options}
      value={selected}
      onValueChange={(option) => onChange(option ? option.value : "")}
      isItemEqualToValue={(a, b) => a.value === b.value}
      filter={hasDescriptions ? filter : undefined}
      disabled={isDisabled}
    >
      <ComboboxPrimitive.InputGroup
        data-slot="combobox-input-group"
        className={cn(
          "flex h-10 w-full items-center gap-1.5 rounded-md border bg-canvas px-4 transition-colors focus-within:border-ink",
          error ? "border-error-brand" : "border-hairline-strong",
          isDisabled && "cursor-not-allowed bg-surface",
          className
        )}
      >
        <ComboboxPrimitive.Input
          id={id}
          placeholder={loading ? "Loading..." : placeholder}
          disabled={isDisabled}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-graphite",
            isDisabled && "cursor-not-allowed text-graphite"
          )}
        />
        <ComboboxPrimitive.Icon
          render={<ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-graphite" />}
        />
      </ComboboxPrimitive.InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner className="isolate z-50" sideOffset={4}>
          <ComboboxPrimitive.Popup
            data-slot="combobox-popup"
            className="max-h-72 w-(--anchor-width) overflow-x-hidden overflow-y-auto rounded-md border border-hairline-strong bg-canvas shadow-lg"
          >
            <ComboboxPrimitive.Empty className="px-3 py-2 text-sm text-graphite">
              No matches
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List>
              {(option: ComboboxOption) => (
                <ComboboxPrimitive.Item
                  key={option.value}
                  value={option}
                  className="relative flex w-full cursor-default items-center justify-between gap-2 px-3 py-2 text-sm text-charcoal outline-none select-none data-highlighted:bg-surface data-highlighted:text-ink"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{option.label}</span>
                    {option.description && (
                      <span className="block truncate text-xs text-slate">{option.description}</span>
                    )}
                  </span>
                  <ComboboxPrimitive.ItemIndicator>
                    <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary-brand" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  )
}

export { Combobox }
