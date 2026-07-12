import "./Sidebar.css";
function Sidebar({ items, selectedPage, onSelectPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>TransitOPS</h2>
      </div>

      <nav className="sidebar-content" aria-label="Sidebar Navigation">
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={selectedPage === item.key ? "active" : ""}
                onClick={() => onSelectPage(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
