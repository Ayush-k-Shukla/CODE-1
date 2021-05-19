import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext, InfoContext } from "../state/Store";
import { clearMsgs } from "../state/auth/authActions";
import { clearEverything, generateError } from "../state/info/infoActions";
import { signupUser } from "../state/auth/authActions";
import registerImage from "./assets/register.svg";
import lock from "./assets/lock.svg";
import mail from "./assets/mail.svg";
import user from "./assets/user.svg";
import briefcase from "./assets/briefcase.svg";
import Navbar from "./Navbar";
import { Link, Redirect } from "react-router-dom";
import Loader from "./Loader";
import "./styles/register.scss";
//custom hook to use Input for different form fields
//================================================================================
export const useInput = ({ type, placeholder }) => {
  const [value, setValue] = useState("");
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
      placeholder={placeholder}
    />
  );
  return [value, input];
};
//================================================================================
const Register = (props) => {
  //Context
  const auth = useContext(AuthContext);
  const info = useContext(InfoContext);
  //form values
  const [name, nameInput] = useInput({ type: "text", placeholder: "Name" });
  const [email, emailInput] = useInput({ type: "email", placeholder: "Email" });
  const [password, passwordInput] = useInput({
    type: "password",
    placeholder: "Password",
  });
  const [confirmPassword, confirmPasswordInput] = useInput({
    type: "password",
    placeholder: "Confirm Password",
  });
  const [role, setRole] = useState("Student");
  //used to get to know when component updates due to user writing in different fields
  //===============================================================================
  const mounted = useRef();
  //when user starts typing in form fields, messages shown due to user errors gets invisible, when component mounts
  // there are no messages visible to the user buffered due to previous actions
  useEffect(() => {
    const clearLogs = () => {
      auth.dispatch(clearMsgs()); //clear errors buffered in auth state;
      info.dispatch(clearEverything()); //clears errors buffered in info state;
    };
    if (!mounted.current) {
      clearLogs(); //when this components mounts their should not be any messages show, may be buffered due to previous actions
      mounted.current = true;
    } else clearLogs(); //when user writes in form fields, messages shown due to user errors are now not visible
  }, [name, email, password, confirmPassword]);
  //when there is an info from backend, so it to user
  //==============================================================================
  useEffect(() => {
    if (auth.state.signupError) {
      info.dispatch(generateError(auth.state.signupError));
    }
  }, [auth.state.signupError]);
  //handles form submit
  //===============================================================================
  const handleSubmit = (e) => {
    if (name && email && password && confirmPassword && role) {
      if (password == confirmPassword)
        signupUser(auth.dispatch, {
          name,
          email,
          password,
          confirmPassword,
          role,
        });
      else {
        info.dispatch(generateError("Passwords do not match!"));
      }
    } else if (!name || !email || !password || !confirmPassword || role) {
      info.dispatch(generateError("Please fill in all the fields"));
    }
    e.preventDefault();
  };
  //view
  //==================================================================================
  return (
    <React.Fragment>
      {auth.state.userLoggedIn ? (
        <React.Fragment>
          {auth.state.emailVerified ? (
            <Redirect
              to={
                (props.location.state && props.location.state.from) ||
                props.history.goBack() ||
                "/"
              }
            />
          ) : (
            <React.Fragment>
              {props.location.state ? (
                <Redirect
                  to={{
                    pathname: "/sentVerifyEmail",
                    state: { from: props.location.state.from },
                  }}
                />
              ) : (
                <Redirect to="/sentVerifyEmail" />
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Navbar />
          <div className="register-main-container">
            <div className="img-container">
              <img className="register-image" src={registerImage} alt="" />
            </div>
            <div className="form-container">
              <h1>REGISTRATION FORM</h1>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="input-container">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Professional">Professional</option>
                    <option value="Student">Student</option>
                  </select>
                  <img src={briefcase} alt="" />
                </div>
                <div className="input-container">
                  {nameInput}
                  <img src={user} alt="" />
                </div>
                <div className="input-container">
                  {emailInput}
                  <img src={mail} alt="" />
                </div>
                <div className="input-container">
                  {passwordInput}
                  <img src={lock} alt="" />
                </div>
                <div className="input-container">
                  {confirmPasswordInput}
                  <img src={lock} alt="" />
                </div>
                <div className="button-container">
                  <button type="submit">REGISTER</button>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      display: "inline-block",
                      marginRight: ".5rem",
                      marginTop: "1rem",
                    }}
                  >
                    Already Registered?
                  </span>
                  <Link className="link" to="/login">
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      )}
      {auth.state.userLogginIn && <Loader />}
    </React.Fragment>
  );
};

export default Register;
