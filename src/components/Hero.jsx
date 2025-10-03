import React from "react";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <div className="row">
          <div className="col-lg-8">
            <h1 className="hero-title">Unlock Your Financial Dreams</h1>
            <p className="hero-subtitle">Expert loan consulting services...</p>
            <a href="#contact" className="btn btn-apply">
              <i className="fas fa-rocket me-2"></i>Apply Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
