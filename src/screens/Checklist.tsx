import { useState } from 'react'
import { useAppStore } from '@/store/app'
import confetti from 'canvas-confetti'
import { uuid } from '@/lib/utils'
import toast from 'react-hot-toast'

const BADGE_CLASS: Record<string, string> = {
  'Done': 'cl-badge-done',
  'Covered': 'cl-badge-covered',
  'To Do': 'cl-badge-nr',
  'In Progress': 'cl-badge-twd',
}

export default function Checklist() {
  const { wedding, clCategories, clTasks, toggleTask, addTask } = useAppStore()
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['cc1', 'cc2', 'cc3']))
  const [showAdd, setShowAdd] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskCat, setNewTaskCat] = useState(clCategories[1]?.id ?? '')

  const totalTasks = clTasks.length
  const doneTasks = clTasks.filter(t => t.is_done).length
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

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

  function handleAddTask() {
    if (!newTaskName.trim()) return
    addTask({
      id: uuid(),
      category_id: newTaskCat,
      wedding_id: wedding?.id ?? 'w1',
      name: newTaskName.trim(),
      is_done: false,
      cost_estimate: null,
      due_date: null,
      assigned_to: '',
      sort_order: 999,
    })
    setNewTaskName('')
    setShowAdd(false)
    toast.success('Task added!')
  }

  const sortedCats = [...clCategories].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Checklist</div>
          <div className="page-date">{doneTasks} of {totalTasks} tasks completed</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setShowAdd(true)}>+ Add Task</button>
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
                      onClick={() => handleToggleTask(task.id, cat.id)}
                    >
                      <div className={`cl-check${task.is_done ? ' checked' : ''}`} />
                      <div className={`cl-task-name${task.is_done ? ' done' : ''}`}>
                        {task.name}
                      </div>
                      {task.assigned_to && (
                        <span className="badge badge-muted" style={{ fontSize: '10px', marginLeft: 'auto' }}>{task.assigned_to}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
          <div className="modal-box">
            <div className="modal-title">Add Task</div>
            <div className="modal-field">
              <label className="modal-label">Category</label>
              <select className="select" value={newTaskCat} onChange={e => setNewTaskCat(e.target.value)}>
                {clCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Task</label>
              <input className="input" placeholder="e.g. Book honeymoon hotel" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-rose" onClick={handleAddTask} disabled={!newTaskName.trim()}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
