import { useState } from 'react'
import { useAppStore } from '@/store/app'
import confetti from 'canvas-confetti'
import { uuid } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ChecklistTask } from '@/types'

const BADGE_CLASS: Record<string, string> = {
  'Done': 'cl-badge-done',
  'Covered': 'cl-badge-covered',
  'To Do': 'cl-badge-nr',
  'In Progress': 'cl-badge-twd',
}

// ── Task Edit Modal ────────────────────────────────────────────────────
function TaskModal({
  task,
  defaultCatId,
  onClose,
}: {
  task: ChecklistTask | null
  defaultCatId: string
  onClose: () => void
}) {
  const { clCategories, addTask, updateTask, removeTask } = useAppStore()
  const isNew = task === null

  const [name, setName] = useState(task?.name ?? '')
  const [catId, setCatId] = useState(task?.category_id ?? defaultCatId)
  const [dueDate, setDueDate] = useState(task?.due_date ?? '')
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to ?? '')
  const [costEstimate, setCostEstimate] = useState(task?.cost_estimate != null ? String(task.cost_estimate) : '')

  function handleSave() {
    if (!name.trim()) return
    if (isNew) {
      addTask({
        id: uuid(),
        category_id: catId,
        wedding_id: useAppStore.getState().wedding?.id ?? 'w1',
        name: name.trim(),
        is_done: false,
        cost_estimate: costEstimate ? Number(costEstimate) : null,
        due_date: dueDate || null,
        assigned_to: assignedTo.trim(),
        sort_order: 999,
      })
      toast.success('Task added!')
    } else {
      updateTask(task!.id, {
        name: name.trim(),
        category_id: catId,
        cost_estimate: costEstimate ? Number(costEstimate) : null,
        due_date: dueDate || null,
        assigned_to: assignedTo.trim(),
      })
      toast.success('Task updated')
    }
    onClose()
  }

  function handleDelete() {
    if (!task) return
    const snapshot = { ...task }
    removeTask(task.id)
    onClose()
    toast((t) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Removed "{snapshot.name}"</span>
        <button
          onClick={() => { addTask(snapshot); toast.dismiss(t.id) }}
          style={{ fontSize: '11px', fontWeight: 600, color: 'var(--rose-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">{isNew ? 'Add Task' : 'Edit Task'}</div>
        <div className="modal-field">
          <label className="modal-label">Category</label>
          <select className="select" value={catId} onChange={e => setCatId(e.target.value)}>
            {clCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">Task *</label>
          <input className="input" placeholder="e.g. Book honeymoon hotel" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Due Date</label>
            <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Assigned To</label>
            <input className="input" placeholder="e.g. Priya" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Cost Estimate (₹)</label>
          <input className="input" type="number" min="0" placeholder="Optional" value={costEstimate} onChange={e => setCostEstimate(e.target.value)} />
        </div>
        <div className="modal-footer">
          {!isNew && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--rose-dark)', marginRight: 'auto' }}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!name.trim()}>
            {isNew ? 'Add Task' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Checklist Screen ───────────────────────────────────────────────────
export default function Checklist() {
  const { clCategories, clTasks, toggleTask } = useAppStore()
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['cc1', 'cc2', 'cc3']))
  const [taskModal, setTaskModal] = useState<ChecklistTask | null | undefined>(undefined)
  // undefined = closed, null = adding new, ChecklistTask = editing

  const totalTasks = clTasks.length
  const doneTasks = clTasks.filter(t => t.is_done).length
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  const defaultCatId = clCategories[0]?.id ?? ''

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleToggleTask(taskId: string, catId: string) {
    toggleTask(taskId)
    const catTasks = clTasks.filter(t => t.category_id === catId)
    const doneAfter = catTasks.filter(t => t.id === taskId ? !t.is_done : t.is_done).length
    if (doneAfter === catTasks.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E8748A', '#7AAA90', '#D4956A', '#A06080', '#F4B8C2'],
      })
    }
  }

  const sortedCats = [...clCategories].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Checklist</div>
          <div className="page-date">{doneTasks} of {totalTasks} tasks completed</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setTaskModal(null)}>+ Add Task</button>
      </div>

      <div className="page-body">
        {/* Summary bar */}
        <div className="cl-summary-bar">
          <div className="cl-summary-stat">
            <div className="cl-summary-num">{totalTasks}</div>
            <div className="cl-summary-lbl">Total Tasks</div>
          </div>
          <div className="cl-summary-div" />
          <div className="cl-summary-stat">
            <div className="cl-summary-num">{doneTasks}</div>
            <div className="cl-summary-lbl">Completed</div>
          </div>
          <div className="cl-summary-div" />
          <div className="cl-summary-stat">
            <div className="cl-summary-num">{totalTasks - doneTasks}</div>
            <div className="cl-summary-lbl">Remaining</div>
          </div>
          <div className="cl-overall-prog">
            <div className="cl-overall-track">
              <div className="cl-overall-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="cl-overall-pct">{pct}%</div>
          </div>
        </div>

        {/* Category cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedCats.map(cat => {
            const tasks = clTasks.filter(t => t.category_id === cat.id).sort((a, b) => a.sort_order - b.sort_order)
            const catDone = tasks.filter(t => t.is_done).length
            const isOpen = openCats.has(cat.id)

            return (
              <div key={cat.id} className={`cl-cat-card${isOpen ? ' open' : ''}`}>
                <div className="cl-cat-header" onClick={() => toggleCat(cat.id)}>
                  <div className="cl-cat-left">
                    <div className="cl-cat-chevron">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    <div>
                      <div className="cl-cat-name">{cat.name}</div>
                      <div className="cl-cat-meta">{catDone}/{tasks.length} done</div>
                    </div>
                  </div>
                  <div className="cl-cat-right">
                    <span className={`cl-badge ${BADGE_CLASS[cat.badge_label] ?? 'cl-badge-nr'}`}>
                      {cat.badge_label}
                    </span>
                  </div>
                </div>

                <div className="cl-tasks">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="cl-task-row"
                    >
                      <div
                        className={`cl-check${task.is_done ? ' checked' : ''}`}
                        onClick={() => handleToggleTask(task.id, cat.id)}
                      />
                      <div
                        className={`cl-task-name${task.is_done ? ' done' : ''}`}
                        style={{ flex: 1, cursor: 'pointer' }}
                        onClick={() => setTaskModal(task)}
                      >
                        {task.name}
                        {task.due_date && (
                          <span style={{ fontSize: '11px', color: 'var(--ink4)', marginLeft: '8px', fontWeight: 400 }}>
                            · Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      {task.assigned_to && (
                        <span className="badge badge-muted" style={{ fontSize: '10px' }}>{task.assigned_to}</span>
                      )}
                      <button
                        className="btn btn-xs btn-ghost"
                        style={{ opacity: 0.5, marginLeft: '4px' }}
                        onClick={e => { e.stopPropagation(); setTaskModal(task) }}
                        title="Edit task"
                      >
                        ···
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {taskModal !== undefined && (
        <TaskModal
          task={taskModal}
          defaultCatId={defaultCatId}
          onClose={() => setTaskModal(undefined)}
        />
      )}
    </div>
  )
}
