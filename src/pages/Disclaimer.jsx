import React from "react";

function Disclaimer() {
  return (
    <section className="legal-page">
      <div className="legal-container">
        <h1>Disclaimer</h1>
        <div className="legal-divider"></div>

        <p>
          Myneedi Loans is not a bank or a Non-Banking Financial Company (NBFC).
          We provide loan consulting and assistance services only.
        </p>

        <p>
          We do not issue loans directly. Our role is to connect customers with
          appropriate banks and financial institutions.
        </p>

        <p>
          Final loan approval, interest rates, and terms are determined solely by
          the respective banks or financial institutions.
        </p>

        <p>
          Using this website does not guarantee loan approval.
        </p>

        <p>
          Myneedi Loans shall not be held responsible for decisions taken by banks
          or financial institutions.
        </p>
      </div>
    </section>
  );
}

export default Disclaimer;
