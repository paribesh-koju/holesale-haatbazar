import React from "react";

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="top">
        <h2>
          <span className="yellow">Why</span> We are the Best
        </h2>
        <p>
          HolesaleBazar are the best because they offer fresh, high-quality
          produce, support the local economy, and promote sustainability by
          reducing transportation-related carbon footprints. They also foster
          community connections and provide unique, seasonal products while
          encouraging transparency and trust in food sources. By supporting
          local farmers and businesses, these markets contribute to economic
          resilience and cultural preservation.
        </p>
      </div>
      <div className="bottom">
        <div className="box">
          <img src="/assets/images/fresh.jpeg" alt="Fresh Product" />
          <h4>Fresh Product</h4>
          <p>
            HolesaleBazar offers fresh fruits, vegetables, and herbs, often
            sourced directly from nearby farms. This ensures that the produce is
            fresh and in-season.
          </p>
        </div>
        <div className="box">
          <img src="/assets/images/healthy.jpeg" alt="Healthy Foods" />
          <h4>Healthy Foods</h4>
          <p>
            HolesaleBazar provides organic, healthy options and specialty foods,
            including gluten-free, dairy-free, and vegan products.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
