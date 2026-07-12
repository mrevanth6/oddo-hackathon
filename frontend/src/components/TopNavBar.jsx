import "./TopNavBar.css";
function TopNavBar({ title }) {
  return (
    <header className="top-nav-bar">
      <div className="top-nav-bar-left">
        <h1>{title}</h1>
      </div>

      <div className="top-nav-bar-right">
        <span>Welcome, User</span>
      </div>
    </header>
  );
}

export default TopNavBar;
