import { NavLink, useNavigate } from 'react-router-dom';
import { logout, selectUserInfo } from '../features/auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Navbar() {

  const navigate = useNavigate()
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();


  /*handleLogout function is triggered when the user clicks the logout option.
  dispatches the logout action and navigates the user to the login page */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="mb-1 navbar navbar-expand-lg sticky-top navbar-dark  d-flex justify-content-between pink-color">
        <NavLink className="navbar-brand instagram" to={"/"}>Social Media</NavLink>
        <div>
          <ul className="navbar-nav mx-0 nav-flex-icons flex_gap">
            {userInfo ? (
              <>
                <li className="nav-item  ">
                  <div className="profile-container">
                    <div
                      className="profile-circle"

                    >
                      {userInfo?.name[0]?.toUpperCase()}
                    </div>

                    <div className="dropdown-menu ">

                      <li className="nav-item  text-white  font-weight-bold"
                        style={{ cursor: "pointer" }}
                        onClick={handleLogout}

                      >
                        Logout
                      </li>
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <NavLink to="/createpost" className="nav-link waves-effect waves-light" >
                    Create Posts
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link waves-effect waves-light">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/signup" className="nav-link waves-effect waves-light">
                    Signup
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}