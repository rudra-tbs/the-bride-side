import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { PaymentStatus } from '@/types'
import { formatINR, budgetPct, uuid } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_BADGE: Record<PaymentStatus, string> = {
  paid: 'badge-sage', pending: 'badge-muted', due_soon: 'badge-amber', overdue: 'badge-declined',
}
const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Paid', pending: 'Pending', due_soon: 'Due Soon', overdue: 'Overdue',
}

export default function Budget() {
  const { wedding, budgetCategories, expenses, addExpense } = useAppStore()
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['bc1', 'bc2']))
  const [showAdd, setShowAdd] = useState(false)

  // Add expense form state
  const [vendor, setVendor] = useState('')
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [catId, setCatId] = useState(budgetCategories[0]?.id ?? '')
  const [status, setStatus] = useState<PaymentStatus>('pending')

  const totalBudget = wedding?.total_budget ?? 0
  const totalAllocated = budgetCategories.reduce((a, c) => a + c.allocated, 0)
  const totalSpent = expenses.reduce((a, e) => a + e.amount, 0)
  const totalPaid = expenses.filter(e => e.status === 'paid').reduce((a, e) => a + e.amount, 0)

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddExpense() {
    if (!vendor.trim() || !amount) return
    addExpense({
      id: uuid(),
      category_id: catId,
      wedding_id: wedding?.id ?? 'w1',
      vendor_name: vendor.trim(),
      description: desc.trim(),
      amount: parseFloat(amount),
      status,
      due_date: null,
      paid_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null,
      created_at: new Date().toISOString(),
    })
    setVendor(''); setDesc(''); setAmount(''); setStatus('pending')
    setShowAdd(false)
    toast.success('Expense added')
  }

  const sortedCats = [...budgetCategories].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Budget</div>
          <div className="page-date">{budgetCategories.length} categories · {expenses.length} expenses</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setShowAdd(true)}>+ Add Expense</button>
      </div>

      <div className="page-body">
        {/* Hero card */}
        <div className="budget-hero">
          <div className="bh-label">Total Wedding Budget</div>
          <div className="bh-total">{formatINR(totalBudget, true)}</div>
          <div className="bh-meta">
            <span>Allocated: <strong>{formatINR(totalAllocated, true)}</strong></span>
            <span>Spent: <strong>{formatINR(totalSpent, true)}</strong></span>
            <span>Paid: <strong>{formatINR(totalPaid, true)}</strong></span>
            <span>Remaining: <strong>{formatINR(Math.max(0, totalBudget - totalSpent), true)}</strong></span>
          </div>
          <div className="bh-track">
            <div className="bh-fill" style={{ width: `${budgetPct(totalSpent, totalBudget)}%` }} />
          </div>
        </div>

        {/* Categories */}
        {sortedCats.map(cat => {
          const catExpenses = expenses.filter(e => e.category_id === cat.id)
          const catSpent = catExpenses.reduce((a, e) => a + e.amount, 0)
          const pct = budgetPct(catSpent, cat.allocated)
          const isOpen = openCats.has(cat.id)

          return (
            <div key={cat.id} className={`bcat${isOpen ? ' open' : ''}`}>
              <div className="bcat-head" onClick={() => toggleCat(cat.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                  <div>
                    <div className="bcat-name">{cat.name}</div>
                    <div style={{ marginTop: '6px' }}>
                      <div className="prog-bar" style={{ width: '180px' }}>
                        <div
                          className={`prog-fill ${pct > 90 ? 'prog-rose' : pct > 70 ? 'prog-amber' : 'prog-sage'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bcat-right" style={{ marginRight: '12px' }}>
                  <div className="bcat-spent">{formatINR(catSpent, true)}</div>
                  <div className="bcat-of">of {formatINR(cat.allocated, true)}</div>
                </div>
                <div className="bcat-chevron">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="bcat-rows">
                {catExpenses.length === 0 ? (
                  <div style={{ padding: '12px 18px', fontSize: '13px', color: 'var(--ink3)', borderTop: '1px solid var(--border)' }}>
                    No expenses yet.
                  </div>
                ) : (
                  catExpenses.map(exp => (
                    <div className="bexp-row" key={exp.id}>
                      <div>
                        <div className="bexp-vendor">{exp.vendor_name}</div>
                        {exp.description && <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>{exp.description}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${STATUS_BADGE[exp.status]}`}>{STATUS_LABEL[exp.status]}</span>
                        <div className="bexp-amt">{formatINR(exp.amount)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
          <div className="modal-box">
            <div className="modal-title">Add Expense</div>
            <div className="modal-field">
              <label className="modal-label">Category</label>
              <select className="select" value={catId} onChange={e => setCatId(e.target.value)}>
                {budgetCategories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Vendor / Payee</label>
              <input className="input" placeholder="e.g. Pixel Perfect Studios" value={vendor} onChange={e => setVendor(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Description (optional)</label>
              <input className="input" placeholder="e.g. Advance payment" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Amount (₹)</label>
              <input className="input" type="number" placeholder="e.g. 50000" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <select className="select" value={status} onChange={e => setStatus(e.target.value as PaymentStatus)}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="due_soon">Due Soon</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-rose" onClick={handleAddExpense} disabled={!vendor.trim() || !amount}>Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
