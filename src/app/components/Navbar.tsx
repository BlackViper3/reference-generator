const NavBar = () => {
  return (
    <>
      <header>
        <div>
          <input className="checkbox" type="checkbox" id="checkbox" />
          <label htmlFor="checkbox" className   ="label">
            <i className="fa-solid fa-sun"></i>
            <i className="fa-solid fa-moon"></i>
            <div className="ball" />
          </label>
        </div>
      </header>
    </>
  );
};
export default NavBar;
