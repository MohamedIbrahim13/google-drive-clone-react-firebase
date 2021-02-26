import React from "react";
import Signup from "./components/auth-components/Signup";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Profile from "./components/auth-components/Profile";
import Login from "./components/auth-components/Login";
import ForgotPassword from "./components/auth-components/ForgotPassword";
import UpdateProfile from "./components/auth-components/UpdateProfile";
import Dashboard from "./components/drive-components/Dashboard";
import AuthContextProvider from "./context/AuthContext";
import PrivateRoute from "./components/auth-components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          {/* Drive */}
          
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/folder/:folderId" component={Dashboard} />

          {/* Profile */}
          <Route path="/user" component={Profile} />
          <Route path="/update-profile" component={UpdateProfile} />

          {/* Auth */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
