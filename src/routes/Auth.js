import { useState } from "react";
import * as auth from "firebase/auth";
import { authService } from "fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const [newAccount, setNewAcocount] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let account;
      if (newAccount) {
        // create
        account = await auth.createUserWithEmailAndPassword(
          auth.getAuth(),
          email,
          password
        );
      } else {
        // log in
        account = await auth.signInWithEmailAndPassword(
          auth.getAuth(),
          email,
          password
        );
      }
      console.log(account);
    } catch (error) {
      setError(error.message);
    }
  };
  const onChange = ({ target: { name, value } }) => {
    // event.target.name, evnet.target.value
    // { target: { name, value}} = event
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const toggle = () => setNewAcocount((prev) => !prev);
  const onSocial = async ({ target: { name } }) => {
    console.log(`social name: ${name}`);
    try {
      let provider;
      if (name === "google") {
        provider = new auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new auth.GithubAuthProvider();
      }
      const data = await auth.signInWithPopup(authService, provider);
      console.log("result: ", data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          onChange={onChange}
          placeholder="Email"
          required
          value={email}
        />
        <input
          name="password"
          type="password"
          onChange={onChange}
          placeholder="password"
          required
          value={password}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      {error}
      <br />
      <span onClick={toggle}>{newAccount ? "Sign In" : "Create Account"}</span>
      <div>
        <button onClick={onSocial} name="google">
          Continue with Google
        </button>
        <button onClick={onSocial} name="github">
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Auth;
