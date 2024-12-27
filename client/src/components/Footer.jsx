import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectUserInfo } from "../features/auth/AuthSlice";

const Footer = () => {

  const userInfo = useSelector(selectUserInfo);

  return (
    <>
      <section className="">
        <footer className="text-center text-white bg_footer " >
          {!userInfo &&
            <div className="container p-4 pb-0">

              <section className="">
                <p className="d-flex justify-content-center align-items-center">
                  <span className="me-3">Register for free</span>
                  <NavLink to="/signup" data-mdb-ripple-init type="button" className="btn btn-outline-light btn-rounded">
                    Sign up!
                  </NavLink>
                </p>
              </section>

            </div>
          }
          <div className="text-center p-3 copyright_bg" >
            © 2024 Copyright
          </div>
        </footer>
      </section>
    </>
  );
};

export default Footer;