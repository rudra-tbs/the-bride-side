import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app'
import type { Expense, PaymentStatus, BudgetCategory } from '@/types'
import { formatINR, budgetPct, formatDate, uuid } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_BADGE: Record<PaymentStatus, string> = {
  paid: 'badge-sage', pending: 'badge-muted', due_soon: 'badge-amber', overdue: 'badge-declined',
}
const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Paid', pending: 'Pending', due_soon: 'Due Soon', overdue: 'Overdue',
}

// ── Expense Form (shared by Add & Edit) ──────────────────────────────
interface ExpenseFormProps {
  title: string
  initial?: Partial<Expense>
  categories: BudgetCategory[]
  onSave: (data: Omit<Expense, 'id' | 'wedding_id' | 'created_at'>) => void
  onClose: () => void
}
function ExpenseForm({ title, initial = {}, categories, onSave, onClose }: ExpenseFormProps) {
  const [vendor, setVendor]   = useState(initial.vendor_name ?? '')
  const [desc, setDesc]       = useState(initial.description ?? '')
  const [amount, setAmount]   = useState(initial.amount ? String(initial.amount) : '')
  const [catId, setCatId]     = useState(initial.category_id ?? categories[0]?.id ?? '')
  const [status, setStatus]   = useState<PaymentStatus>(initial.status ?? 'pending')
  const [dueDate, setDueDate] = useState(initial.due_date ?? '')

  function handleSave() {
    if (!vendor.trim() || !amount) return
    onSave({
      category_id: catId,
      vendor_name: vendor.trim(),
      description: desc.trim(),
      amount: parseFloat(amount),
      status,
      due_date: dueDate || null,
      paid_date: status === 'paid' ? (initial.paid_date ?? new Date().toISOString().split('T')[0]) : null,
    })
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">{title}</div>
        <div className="modal-field">
          <label className="modal-label">Category</label>
          <select className="select" value={catId} onChange={e => setCatId(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Amount (₹)</label>
            <input className="input" type="number" placeholder="e.g. 50000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Due Date (optional)</label>
            <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
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
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!vendor.trim() || !amount}>
            {title === 'Add Expense' ? 'Add Expense' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Category Modal ───────────────────────────────────────────────
function EditCategoryModal({ cat, onClose }: { cat: BudgetCategory; onClose: () => void }) {
  const { updateBudgetCategory } = useAppStore()
  const [name, setName]         = useState(cat.name)
  const [emoji, setEmoji]       = useState(cat.emoji)
  const [allocated, setAllocated] = useState(String(cat.allocated))

  function handleSave() {
    if (!name.trim() || !allocated) return
    updateBudgetCategory(cat.id, {
      name: name.trim(),
      emoji: emoji.trim() || cat.emoji,
      allocated: parseFloat(allocated),
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">Edit Category</div>
        <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Emoji</label>
            <input className="input" value={emoji} onChange={e => setEmoji(e.target.value)} style={{ textAlign: 'center', fontSize: '18px' }} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Allocated Budget (₹)</label>
          <input className="input" type="number" value={allocated} onChange={e => setAllocated(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!name.trim() || !allocated}>Save</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Budget Screen ────────────────────────────────────────────────
export default function Budget() {
  const { wedding, budgetCategories, expenses, addExpense, updateExpense, removeExpense } = useAppStore()
  const [openCats, setOpenCats]         = useState<Set<string>>(new Set(['bc1', 'bc2']))
  const [showAdd, setShowAdd]           = useState(false)
  const [editingExp, setEditingExp]     = useState<Expense | null>(null)
  const [editingCat, setEditingCat]     = useState<BudgetCategory | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all')
  const [mounted, setMounted]           = useState(false)

  useEffect(() => { requestAnimationFrame(() => setMounted(true)) }, [])

  const totalBudget    = wedding?.total_budget ?? 0
  const totalAllocated = budgetCategories.reduce((a, c) => a + c.allocated, 0)
  const totalSpent     = expenses.reduce((a, e) => a + e.amount, 0)
  const totalPaid      = expenses.filter(e => e.status === 'paid').reduce((a, e) => a + e.amount, 0)

  // Due-soon alert: unpaid expenses with due_date within 7 days
  const today    = new Date(); today.setHours(0, 0, 0, 0)
  const in7Days  = new Date(today); in7Days.setDate(today.getDate() + 7)
  const dueSoonAlerts = expenses.filter(e => {
    if (e.status === 'paid' || !e.due_date) return false
    const d = new Date(e.due_date)
    return d >= today && d <= in7Days
  })
  const overdueAlerts = expenses.filter(e => {
    if (e.status === 'paid' || !e.due_date) return false
    return new Date(e.due_date) < today
  })

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function handleAddExpense(data: Omit<Expense, 'id' | 'wedding_id' | 'created_at'>) {
    addExpense({ id: uuid(), wedding_id: wedding?.id ?? 'w1', created_at: new Date().toISOString(), ...data })
    setShowAdd(false)
    toast.success('Expense added')
  }

  function handleEditExpense(data: Omit<Expense, 'id' | 'wedding_id' | 'created_at'>) {
    if (!editingExp) return
    updateExpense(editingExp.id, data)
    setEditingExp(null)
    toast.success('Expense updated')
  }

  function handleDeleteExpense(exp: Expense) {
    removeExpense(exp.id)
    toast(t => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Deleted "{exp.vendor_name}"</span>
        <button
          onClick={() => { addExpense(exp); toast.dismiss(t.id) }}
          style={{ fontSize: '11px', fontWeight: 600, color: 'var(--rose-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >Undo</button>
      </div>
    ), { duration: 5000 })
  }

  const sortedCats = [...budgetCategories].sort((a, b) => a.sort_order - b.sort_order)
  const overallPct = budgetPct(totalSpent, totalBudget)
  const heroBarColor = overallPct >= 90 ? 'var(--rose-mid)' : overallPct >= 70 ? 'var(--amber)' : 'white'

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

        {/* Due-soon / overdue alert banner */}
        {(dueSoonAlerts.length > 0 || overdueAlerts.length > 0) && (
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdueAlerts.length > 0 && (
              <div style={{ background: 'var(--rose-light)', border: '1px solid var(--rose-mid)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--rose-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700 }}>⚠ {overdueAlerts.length} overdue payment{overdueAlerts.length > 1 ? 's' : ''}</span>
                <span style={{ color: 'var(--ink2)' }}>— {overdueAlerts.map(e => e.vendor_name).join(', ')}</span>
              </div>
            )}
            {dueSoonAlerts.length > 0 && (
              <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700 }}>🔔 {dueSoonAlerts.length} payment{dueSoonAlerts.length > 1 ? 's' : ''} due within 7 days</span>
                <span style={{ color: 'var(--ink2)' }}>— {dueSoonAlerts.map(e => e.vendor_name).join(', ')}</span>
              </div>
            )}
          </div>
        )}

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
            <div className="bh-fill" style={{ width: mounted ? `${Math.min(100, overallPct)}%` : '0%', background: heroBarColor }} />
          </div>
        </div>

        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['all', 'paid', 'pending', 'due_soon', 'overdue'] as const).map(s => (
            <button
              key={s}
              className={`filter-chip${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Categories */}
        {sortedCats.map(cat => {
          const allCatExpenses = expenses.filter(e => e.category_id === cat.id)
          const catExpenses    = statusFilter === 'all' ? allCatExpenses : allCatExpenses.filter(e => e.status === statusFilter)
          const catSpent       = allCatExpenses.reduce((a, e) => a + e.amount, 0)
          const paidCount      = allCatExpenses.filter(e => e.status === 'paid').length
          const pct            = budgetPct(catSpent, cat.allocated)
          const isOver         = catSpent > cat.allocated
          const isOpen         = openCats.has(cat.id)
          const barColor       = isOver ? 'prog-rose' : pct > 90 ? 'prog-rose' : pct > 70 ? 'prog-amber' : 'prog-sage'

          return (
            <div key={cat.id} className={`bcat${isOpen ? ' open' : ''}`}>
              <div className="bcat-head" onClick={() => toggleCat(cat.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{cat.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="bcat-name">{cat.name}</span>
                      {isOver && (
                        <span className="badge badge-declined" style={{ fontSize: '10px' }}>
                          Over by {formatINR(catSpent - cat.allocated, true)}
                        </span>
                      )}
                      {allCatExpenses.length > 0 && (
                        <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                          {paidCount}/{allCatExpenses.length} paid
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="prog-bar" style={{ width: '160px' }}>
                        <div
                          className={`prog-fill ${barColor}`}
                          style={{ width: mounted ? `${Math.min(100, pct)}%` : '0%' }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: isOver ? 'var(--rose-dark)' : 'var(--ink3)' }}>{pct}%</span>
                    </div>
                  </div>
                </div>
                <div className="bcat-right" style={{ marginRight: '4px' }}>
                  <div className="bcat-spent" style={{ color: isOver ? 'var(--rose-dark)' : undefined }}>{formatINR(catSpent, true)}</div>
                  <div className="bcat-of">of {formatINR(cat.allocated, true)}</div>
                </div>
                {/* Edit category button */}
                <button
                  className="btn btn-xs btn-ghost"
                  style={{ flexShrink: 0, marginRight: '4px' }}
                  onClick={e => { e.stopPropagation(); setEditingCat(cat) }}
                  title="Edit category"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <div className="bcat-chevron">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="bcat-rows">
                {catExpenses.length === 0 ? (
                  <div style={{ padding: '12px 18px', fontSize: '13px', color: 'var(--ink3)', borderTop: '1px solid var(--border)' }}>
                    {statusFilter === 'all' ? 'No expenses yet.' : `No ${STATUS_LABEL[statusFilter].toLowerCase()} expenses.`}
                  </div>
                ) : (
                  catExpenses.map(exp => {
                    const isExpOverdue = exp.due_date && exp.status !== 'paid' && new Date(exp.due_date) < today
                    const isExpDueSoon = exp.due_date && exp.status !== 'paid' && !isExpOverdue &&
                      new Date(exp.due_date) <= in7Days
                    return (
                      <div
                        className="bexp-row"
                        key={exp.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditingExp(exp)}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="bexp-vendor">{exp.vendor_name}</div>
                          {exp.description && (
                            <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>{exp.description}</div>
                          )}
                          {exp.due_date && exp.status !== 'paid' && (
                            <div style={{ fontSize: '11px', marginTop: '2px', fontWeight: 600, color: isExpOverdue ? 'var(--rose-dark)' : isExpDueSoon ? 'var(--amber)' : 'var(--ink3)' }}>
                              {isExpOverdue ? '⚠ Overdue · ' : isExpDueSoon ? '🔔 ' : ''}Due {formatDate(exp.due_date, 'd MMM')}
                            </div>
                          )}
                          {exp.status === 'paid' && exp.paid_date && (
                            <div style={{ fontSize: '11px', color: 'var(--sage)', marginTop: '2px' }}>
                              Paid {formatDate(exp.paid_date, 'd MMM')}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span className={`badge ${STATUS_BADGE[exp.status]}`}>{STATUS_LABEL[exp.status]}</span>
                          <div className="bexp-amt">{formatINR(exp.amount, true)}</div>
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={e => { e.stopPropagation(); handleDeleteExpense(exp) }}
                            title="Delete expense"
                          >✕</button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <ExpenseForm
          title="Add Expense"
          categories={budgetCategories}
          onSave={handleAddExpense}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editingExp && (
        <ExpenseForm
          title="Edit Expense"
          initial={editingExp}
          categories={budgetCategories}
          onSave={handleEditExpense}
          onClose={() => setEditingExp(null)}
        />
      )}

      {editingCat && (
        <EditCategoryModal cat={editingCat} onClose={() => setEditingCat(null)} />
      )}
    </div>
  )
}
