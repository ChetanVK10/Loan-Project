// src/components/Services.jsx
import React from "react";
import ServiceCard from "./ServiceCard";

function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="section-title fade-in" data-testid="services-title">
              Our Loan Services
            </h2>
            <p
              className="section-subtitle fade-in"
              data-testid="services-subtitle"
            >
              Comprehensive financial solutions designed to meet your specific requirements
            </p>
          </div>
        </div>

        {/* Row 1: 3 cards */}
        <div className="row g-4">
          <ServiceCard
            img="/personal.jpg"
            icon="fas fa-user-circle"
            title="Personal Loans"
            description="Quick and hassle-free personal loans for your immediate financial needs. Competitive rates and flexible repayment terms."
          />
          <ServiceCard
            img="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&h=600"
            icon="fas fa-home"
            title="Home Loans"
            description="Make your dream home a reality with our comprehensive home loan solutions. Low interest rates and expert guidance throughout."
          />
          <ServiceCard
            img="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=600"
            icon="fas fa-briefcase"
            title="Business Loans"
            description="Fuel your business growth with our tailored business financing solutions. From startups to established enterprises."
          />
        </div>

        {/* Row 2: 2 centered cards */}
        <div className="row g-4 justify-content-center mt-4">
          <ServiceCard
            img="/carloan.png"
            icon="fas fa-car"
            title="Car Loans"
            description="Get your dream car with our flexible car loan solutions at competitive interest rates."
          />
          <ServiceCard
            img="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&h=600"
            icon="fas fa-graduation-cap"
            title="Educational Loans"
            description="Invest in your future with our education loan solutions. Flexible repayment options and low interest rates for students and parents."
          />
        </div>
      </div>
    </section>
  );
}

export default Services;
