import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Landing page: public marketing entry for TaskMaster
 */
export default function Landing() {
  return (
    <div className="container landing">
      <h1 className="title">Welcome to TaskMaster</h1>
      <p className="subtitle">
        Organize tasks, visualize progress, and publish your productivity site.
      </p>
      <div className="cta-group">
        <Link className="btn primary" to="/register">Get Started</Link>
        <Link className="btn ghost" to="/login">Sign In</Link>
        <Link className="btn" to="/u/demo">See a sample profile</Link>
      </div>
    </div>
  );
}
