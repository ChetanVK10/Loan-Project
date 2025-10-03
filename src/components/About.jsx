// src/components/About.jsx
import React from "react";

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column: Text Content */}
          <div className="col-lg-6">
            <div className="about-content fade-in">
              <h2 data-testid="about-title">Why Choose Myneedi Loans?</h2>
              <p data-testid="about-description-1">
              With over a decade of experience in financial consulting, Myneedi Loans, led personally by Mr.Amarnath Myneedi, has helped countless clients achieve their financial goals. He provides personalized guidance tailored to each client’s unique situation.
              </p>
              <p data-testid="about-description-2">
              Known for honesty, competitive rates, and dedicated service, Myneedi Loans makes the borrowing process simple and stress-free. Whether you want to consolidate debt, purchase a home, or expand your business, you’ll get one-on-one support every step of the way.
              </p>

              {/* Stats Section */}
              <div className="stats">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="stat-item">
                      <span className="stat-number" data-testid="stat-clients">5000+</span>
                      <div className="stat-label">Happy Clients</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <span className="stat-number" data-testid="stat-loans">50M+</span>
                      <div className="stat-label">Loans Processed</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <span className="stat-number" data-testid="stat-approval">98%</span>
                      <div className="stat-label">Approval Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="col-lg-6">
            <div className="about-img fade-in">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&h=600"
                alt="Professional financial consulting services"
                className="img-fluid"
                data-testid="about-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
