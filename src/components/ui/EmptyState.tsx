interface EmptyStateProps {
  icon: string
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{subtitle}</div>
      {action && (
        <button className="btn btn-rose btn-sm" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
