'use client'

import { useMemo, useState, useCallback } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table'

/* ==============================
   Types (sin cambios)
================================ */

type SearchRecord = Record<string, unknown>

export type NavigateFn = (opts: {
  search:
    | true
    | SearchRecord
    | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord)
  replace?: boolean
}) => void

type UseTableUrlStateParams = {
  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    defaultPageSize?: number
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: Array<
    | {
        columnId: string
        searchKey: string
        type?: 'string'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
    | {
        columnId: string
        searchKey: string
        type: 'array'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
  >
}

/* ==============================
   Helpers Next.js
================================ */

function useNextSearch(): SearchRecord {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const obj: SearchRecord = {}

    searchParams.forEach((value, key) => {
      if (obj[key]) {
        obj[key] = Array.isArray(obj[key])
          ? [...(obj[key] as unknown[]), value]
          : [obj[key], value]
      } else {
        const num = Number(value)
        obj[key] = isNaN(num) ? value : num
      }
    })

    return obj
  }, [searchParams])
}

function useNextNavigate(search: SearchRecord): NavigateFn {
  const router = useRouter()
  const pathname = usePathname()

  return useCallback(
    ({ search: nextSearch, replace }) => {
      const resolved =
        typeof nextSearch === 'function'
          ? nextSearch(search)
          : nextSearch === true
          ? search
          : nextSearch

      const params = new URLSearchParams()

      Object.entries(resolved).forEach(([key, value]) => {
        if (value == null) return

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.set(key, String(value))
        }
      })

      const url = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname

      replace ? router.replace(url) : router.push(url)
    },
    [router, pathname, search]
  )
}

/* ==============================
   Hook principal
================================ */

export function useTableUrlState(
  params: UseTableUrlStateParams
) {
  const {
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
  } = params

  /* 🔹 Next.js router state */
  const search = useNextSearch()
  const navigate = useNextNavigate(search)

  /* ==============================
     Tu código original (99% igual)
  ================================ */

  const pageKey = paginationCfg?.pageKey ?? 'page'
  const pageSizeKey = paginationCfg?.pageSizeKey ?? 'pageSize'
  const defaultPage = paginationCfg?.defaultPage ?? 1
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10

  const globalFilterKey = globalFilterCfg?.key ?? 'filter'
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true
  const trimGlobal = globalFilterCfg?.trim ?? true

  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = []
    for (const cfg of columnFiltersCfg) {
      const raw = search[cfg.searchKey]
      const deserialize = cfg.deserialize ?? ((v) => v)

      if (cfg.type === 'string') {
        const value = (deserialize(raw) as string) ?? ''
        if (value.trim()) {
          collected.push({ id: cfg.columnId, value })
        }
      } else {
        const value = (deserialize(raw) as unknown[]) ?? []
        if (Array.isArray(value) && value.length) {
          collected.push({ id: cfg.columnId, value })
        }
      }
    }
    return collected
  }, [columnFiltersCfg, search])

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)

  const pagination: PaginationState = useMemo(() => {
    const rawPage = search[pageKey]
    const rawPageSize = search[pageSizeKey]

    const pageNum = typeof rawPage === 'number' ? rawPage : defaultPage
    const pageSizeNum =
      typeof rawPageSize === 'number'
        ? rawPageSize
        : defaultPageSize

    return {
      pageIndex: Math.max(0, pageNum - 1),
      pageSize: pageSizeNum,
    }
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize])

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next =
      typeof updater === 'function'
        ? updater(pagination)
        : updater

    navigate({
      search: (prev) => ({
        ...prev,
        [pageKey]:
          next.pageIndex + 1 === defaultPage
            ? undefined
            : next.pageIndex + 1,
        [pageSizeKey]:
          next.pageSize === defaultPageSize
            ? undefined
            : next.pageSize,
      }),
    })
  }

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    if (!globalFilterEnabled) return ''
    const raw = search[globalFilterKey]
    return typeof raw === 'string' ? raw : ''
  })

  const onGlobalFilterChange: OnChangeFn<string> | undefined =
    globalFilterEnabled
      ? (updater) => {
          const next =
            typeof updater === 'function'
              ? updater(globalFilter)
              : updater

          const value = trimGlobal ? next.trim() : next
          setGlobalFilter(value)

          navigate({
            search: (prev) => ({
              ...prev,
              [pageKey]: undefined,
              [globalFilterKey]: value || undefined,
            }),
          })
        }
      : undefined

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater
  ) => {
    const next =
      typeof updater === 'function'
        ? updater(columnFilters)
        : updater

    setColumnFilters(next)

    const patch: SearchRecord = {}

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId)
      const serialize = cfg.serialize ?? ((v) => v)

      if (cfg.type === 'string') {
        const value =
          typeof found?.value === 'string'
            ? found.value
            : ''
        patch[cfg.searchKey] = value
          ? serialize(value)
          : undefined
      } else {
        const value = Array.isArray(found?.value)
          ? found!.value
          : []
        patch[cfg.searchKey] = value.length
          ? serialize(value)
          : undefined
      }
    }

    navigate({
      search: (prev) => ({
        ...prev,
        [pageKey]: undefined,
        ...patch,
      }),
    })
  }

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: 'first' | 'last' } = {
      resetTo: 'first',
    }
  ) => {
    const current = search[pageKey]
    const pageNum =
      typeof current === 'number' ? current : defaultPage

    if (pageCount > 0 && pageNum > pageCount) {
      navigate({
        replace: true,
        search: (prev) => ({
          ...prev,
          [pageKey]:
            opts.resetTo === 'last'
              ? pageCount
              : undefined,
        }),
      })
    }
  }

  return {
    globalFilter: globalFilterEnabled ? globalFilter : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  }
}
