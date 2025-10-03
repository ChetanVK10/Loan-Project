// src/components/ServiceCard.jsx
import React from "react";

function ServiceCard({ img, icon, title, description }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="service-card fade-in">
        <img src={img} alt={title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">
            <i className={`me-2 text-warning ${icon}`}></i> {title}
          </h5>
          <p className="card-text">{description}</p>
          <a href="#contact" className="btn btn-learn-more">Learn More</a>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
