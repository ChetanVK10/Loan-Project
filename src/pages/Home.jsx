// src/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <section id="home"><Hero /></section>
      <section id="services"><Services /></section>
      <section id="about"><About /></section>
      <section id="contact"><Contact /></section>
      <Footer />
    </>
  );
}

export default Home;
