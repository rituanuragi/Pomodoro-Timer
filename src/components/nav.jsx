import React, { useContext, useState } from "react";
import AppContext from "../utils/context";
import { fapp, googleP } from "../utils/fb";
import Settings from "./settings";

export default function Nav() {
  let [showSettings, setShowSettings] = useState(false);
  const { user } = useContext(AppContext);

  function signOut() {
    fapp.auth().signOut();
  }

  function signIn() {
    fapp.auth().signInWithPopup(googleP);
  }

  return (
    <div className="Nav">
      <div className="flex bg-black items-center space-x-2 p-2 text-white font-sans">
        <button
          className="bg-white text-black rounded p-1"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <div className="flex-grow" />
        {user ? (
          <button className="bg-white text-black rounded p-1" onClick={signOut}>
            Log Out
          </button>
        ) : (
          <button className="bg-white text-black rounded p-1" onClick={signIn}>
            Login
          </button>
        )}
      </div>
      <Settings showSettings={showSettings} setShowSettings={setShowSettings} />
    </div>
  );
}
