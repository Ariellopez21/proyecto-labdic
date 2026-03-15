// src/services/loan.service.ts
import { apiFetch } from '@/services/api'
import type { LoanRequest, LoanRequestCreatePayload } from '@/types/loan.types'

const BASE = '/labdic_inventory/loans'

export const getLoans      = () => apiFetch<LoanRequest[]>(BASE)
export const getMyLoans    = () => apiFetch<LoanRequest[]>(`${BASE}/me`)
export const getLoan       = (id: number) => apiFetch<LoanRequest>(`${BASE}/${id}`)

export const createLoan    = (payload: LoanRequestCreatePayload) =>
  apiFetch<LoanRequest>(BASE, { method: 'POST', json: payload })

export const approveLoan   = (id: number) =>
  apiFetch<LoanRequest>(`${BASE}/${id}/approve`,  { method: 'PATCH' })

export const rejectLoan    = (id: number) =>
  apiFetch<LoanRequest>(`${BASE}/${id}/reject`,   { method: 'PATCH' })

export const deliverLoan   = (id: number) =>
  apiFetch<LoanRequest>(`${BASE}/${id}/deliver`,  { method: 'PATCH' })

export const returnLoan    = (id: number) =>
  apiFetch<LoanRequest>(`${BASE}/${id}/return`,   { method: 'PATCH' })

export const deleteLoan    = (id: number) =>
  apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })
