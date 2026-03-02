'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { getFlagEmoji } from '@/lib/utils'
import { getCountriesList } from '@/lib/countries'
import { ChevronDown } from 'lucide-react'

export type CountryOption = { code: string; name: string }

interface CountrySelectProps {
  value: CountryOption | null
  onChange: (country: CountryOption | null) => void
  placeholder?: string
  id?: string
  className?: string
  disabled?: boolean
}

const COUNTRIES = getCountriesList()

export default function CountrySelect({
  value,
  onChange,
  placeholder = 'Search country...',
  id,
  className = '',
  disabled = false,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return COUNTRIES.slice(0, 50)
    const q = query.toLowerCase()
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    ).slice(0, 80)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      const el = e.target as Node
      if (listRef.current?.contains(el) || inputRef.current?.contains(el)) return
      setOpen(false)
    }
    document.addEventListener('click', handle)
    return () => document.removeEventListener('click', handle)
  }, [open])

  const displayValue = value ? `${getFlagEmoji(value.code)} ${value.name}` : ''

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center gap-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-left focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary cursor-text"
        onClick={() => {
          if (!disabled) {
            setOpen(true)
            setQuery('')
          }
        }}
      >
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={open ? query : displayValue}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          placeholder={value ? undefined : placeholder}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted"
          autoComplete="off"
        />
        <ChevronDown
          className={`w-5 h-5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-muted text-sm">No country found</li>
          ) : (
            filtered.map((country) => (
              <li
                key={country.code}
                role="option"
                aria-selected={value?.code === country.code}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-primary/10 text-foreground"
                onClick={() => {
                  onChange(country)
                  setQuery('')
                  setOpen(false)
                }}
              >
                <span className="text-xl leading-none" aria-hidden>
                  {getFlagEmoji(country.code)}
                </span>
                <span>{country.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
