import React from "react";

const Home = () => {
  return (
    <section className="home" id="home">
      <div className="content">
        <h1>
          Order Your Product <span className="yellow">Easier & Faster.</span>
        </h1>
        <p>
          HolesaleBazar is a leading global online local food marketplace,
          connecting consumers and farmers through its platform in different
          areas.
        </p>
        <a href="/register" className="home-btn">
          Go to Menu
        </a>
      </div>
      <div className="image">
        <img src="/assets/images/local.jpeg" alt="Delivery" />
      </div>
    </section>
  );
};

export default Home;
