import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { PinCategory } from '@/types'
import { uuid } from '@/lib/utils'
import toast from 'react-hot-toast'

const CAT_FILTERS: { value: PinCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',      label: 'All',      emoji: '✨' },
  { value: 'decor',    label: 'Decor',    emoji: '🌸' },
  { value: 'outfit',   label: 'Outfit',   emoji: '👗' },
  { value: 'makeup',   label: 'Makeup',   emoji: '💄' },
  { value: 'venue',    label: 'Venue',    emoji: '🏛️' },
  { value: 'food',     label: 'Food',     emoji: '🍽️' },
  { value: 'lighting', label: 'Lighting', emoji: '💡' },
  { value: 'other',    label: 'Other',    emoji: '📌' },
]

const CAT_EMOJI: Record<PinCategory, string> = {
  decor: '🌸', outfit: '👗', makeup: '💄', venue: '🏛️', food: '🍽️', lighting: '💡', other: '📌',
}

// Generate a gradient background for a pin based on its color palette or category
function pinBg(palette: string[], category: PinCategory): string {
  if (palette.length >= 2) return `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`
  const fallbacks: Record<PinCategory, string> = {
    decor: 'linear-gradient(135deg, #FDE8EC, #F4B8C2)',
    outfit: 'linear-gradient(135deg, #F2E8F0, #C898B8)',
    makeup: 'linear-gradient(135deg, #FAF0E8, #F4B8C2)',
    venue: 'linear-gradient(135deg, #E8F0F8, #C898B8)',
    food: 'linear-gradient(135deg, #FAF0E8, #E8F4EE)',
    lighting: 'linear-gradient(135deg, #2A1A20, #5A3A48)',
    other: 'linear-gradient(135deg, #F2E8F0, #FDE8EC)',
  }
  return fallbacks[category]
}

export default function Moodboard() {
  const { wedding, pins, addPin, removePin, togglePinLike } = useAppStore()
  const [catFilter, setCatFilter] = useState<PinCategory | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState<PinCategory>('decor')

  const filtered = pins.filter(p => catFilter === 'all' || p.category === catFilter)
  const liked = pins.filter(p => p.is_liked).length

  function handleAdd() {
    if (!caption.trim()) return
    addPin({
      id: uuid(),
      wedding_id: wedding?.id ?? 'w1',
      image_url: imageUrl.trim(),
      storage_path: null,
      caption: caption.trim(),
      category,
      is_liked: false,
      color_palette: [],
      created_at: new Date().toISOString(),
    })
    setCaption(''); setImageUrl(''); setCategory('decor')
    setShowAdd(false)
    toast.success('Pin added to moodboard!')
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Moodboard</div>
          <div className="page-date">{pins.length} pins · {liked} liked</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setShowAdd(true)}>+ Add Pin</button>
      </div>

      <div style={{ padding: '12px 28px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CAT_FILTERS.map(c => (
          <button
            key={c.value}
            className={`filter-chip${catFilter === c.value ? ' active' : ''}`}
            onClick={() => setCatFilter(c.value)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink3)', padding: '48px 0' }}>No pins yet in this category.</div>
        ) : (
          <div className="mood-grid">
            {filtered.map(pin => {
              const bg = pinBg(pin.color_palette, pin.category)
              const height = 120 + (pin.id.charCodeAt(1) % 3) * 40 // varied heights
              return (
                <div className="mood-pin" key={pin.id}>
                  <div
                    className="mood-pin-img"
                    style={{
                      background: pin.image_url ? undefined : bg,
                      height: `${height}px`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                      ...(pin.image_url ? {
                        backgroundImage: `url(${pin.image_url})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      } : {}),
                    }}
                  >
                    {!pin.image_url && CAT_EMOJI[pin.category]}
                    <div className="mood-pin-acts">
                      <button
                        className={`mood-pin-btn${pin.is_liked ? ' saved' : ''}`}
                        onClick={() => togglePinLike(pin.id)}
                        title={pin.is_liked ? 'Unlike' : 'Like'}
                      >
                        {pin.is_liked ? '♥' : '♡'}
                      </button>
                      <button
                        className="mood-pin-btn"
                        onClick={() => { removePin(pin.id); toast('Pin removed') }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="mood-pin-foot">
                    <div style={{ fontWeight: 500, fontSize: '12px', color: 'var(--ink)', marginBottom: '3px' }}>{pin.caption}</div>
                    <span className="badge badge-muted" style={{ fontSize: '9px' }}>{pin.category}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
          <div className="modal-box">
            <div className="modal-title">Add Inspiration Pin</div>
            <div className="modal-field">
              <label className="modal-label">Image URL (optional)</label>
              <input className="input" type="url" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Caption</label>
              <input className="input" placeholder="Describe your inspiration..." value={caption} onChange={e => setCaption(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Category</label>
              <select className="select" value={category} onChange={e => setCategory(e.target.value as PinCategory)}>
                <option value="decor">🌸 Decor</option>
                <option value="outfit">👗 Outfit</option>
                <option value="makeup">💄 Makeup</option>
                <option value="venue">🏛️ Venue</option>
                <option value="food">🍽️ Food</option>
                <option value="lighting">💡 Lighting</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-rose" onClick={handleAdd} disabled={!caption.trim()}>Add Pin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
