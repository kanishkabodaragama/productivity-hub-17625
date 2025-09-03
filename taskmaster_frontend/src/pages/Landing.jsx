import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Landing page: public marketing entry for TaskMaster
 */
export default function Landing() {
  return (
    <div className="container landing" style={{ textAlign: 'center', maxWidth: 960 }}>
      <h1 className="title" style={{ fontSize: '2.25rem' }}>Welcome to TaskMaster</h1>
      <p className="subtitle" style={{ fontSize: '1.05rem' }}>
        Organize tasks, visualize progress, and publish your productivity site.
      </p>
      <div className="cta-group" style={{ justifyContent: 'center' }}>
        <Link className="btn primary" to="/register">Get Started</Link>
        <Link className="btn ghost" to="/login">Sign In</Link>
        <Link className="btn" to="/u/demo">See a sample profile</Link>
      </div>
    </div>
  );
}
