// Small card used on the admin Dashboard.
// The "color" prop is accepted but ignored on purpose, so every card uses
// the Rentify blue instead of random colors.
export default function StatCard({ title, value, change, Icon }) {
  return (
    <div className="statcard">
      <div className="statcard-top">
        <span>{title}</span>
        {Icon && (
          <span className="statcard-icon">
            <Icon size={18} />
          </span>
        )}
      </div>
      <h2>{value}</h2>
      {change && <small className="statcard-change">{change}</small>}
    </div>
  )
}