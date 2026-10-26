import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const defaults = [
  ["Post-Matric Scholarship", "Government", "₹50,000/year"],
  ["Reliance Foundation Scholarship", "Private", "₹2,00,000"],
  ["Central Sector Scholarship", "Government", "₹12,000/year"]
];

const photos = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
];

function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/scholarships")
      .then(res => setData(res.data.data || []))
      .catch(() => {});
  }, []);

  const scholarships = data.length
    ? data.slice(0, 3).map(s => [s.name, s.provider_type, s.amount])
    : defaults;

  const total = data.length || defaults.length;
  const govt = data.filter(s => s.provider_type === "Government").length;
  const priv = data.filter(s => s.provider_type === "Private").length;

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;font-family:Arial;background:#f4f8f6}
        .hero-section,.section{padding:50px 6%}
        .hero{max-width:1700px;margin:auto;min-height:600px;border-radius:40px;
          background:linear-gradient(90deg,#033c2b,#054f39cc,#08553c88),
          url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80");
          background-size:cover;background-position:center}
        .hero-content{min-height:600px;display:flex;align-items:center;padding:60px}
        .hero-left{width:58%;color:white}
        .hero-label{display:inline-block;padding:12px 20px;border:1px solid #ffffff55;
          border-radius:30px;margin-bottom:25px}
        .hero h1{font-size:70px;line-height:1;font-weight:900;margin:0 0 25px}
        .hero h1 span{color:#ffd15c}
        .hero p{font-size:19px;line-height:1.7;max-width:800px}
        .buttons{display:flex;gap:12px;margin-top:30px}
        .check-btn,.browse-btn{padding:18px 28px;border-radius:12px;text-decoration:none;font-weight:bold}
        .check-btn{background:#ffc445;color:#173b31}
        .browse-btn{color:white;border:1px solid white}
        .hero-right{width:42%;display:flex;justify-content:center}
        .image-box{padding:15px;border:1px solid #ffffff55;background:#ffffff20;border-radius:25px}
        .image-box img{width:100%;max-width:520px;height:420px;object-fit:cover;border-radius:20px}
        .card,.photo-card{background:white;border-radius:18px;border:1px solid #e3ebe7;
          padding:25px;height:100%;box-shadow:0 5px 20px #00000008}
        .card p,.photo-content p{color:#66756f}
        .photo-card{padding:0;overflow:hidden}
        .photo-card img{width:100%;height:210px;object-fit:cover}
        .photo-content{padding:20px}
        .categories{background:#eaf4ee}
        .step{width:55px;height:55px;border-radius:50%;background:#16754f;color:white;
          display:flex;align-items:center;justify-content:center;font-weight:bold}
        @media(max-width:992px){
          .hero-content{flex-direction:column;padding:40px 25px}
          .hero-left,.hero-right{width:100%}.hero h1{font-size:50px}
          .hero-right{margin-top:35px}
        }
        @media(max-width:576px){
          .hero-section{padding:20px}.hero{border-radius:25px}
          .hero h1{font-size:40px}.buttons{flex-direction:column}
          .check-btn,.browse-btn{text-align:center}.image-box img{height:280px}
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-label">🎓 SCHOLARSHIP DISCOVERY PLATFORM</div>
              <h1>Find funding that <br />fits <span>your future.</span></h1>
              <p>
                Answer a few questions and instantly discover scholarships
                that match your academic profile, income and course.
              </p>

              <div className="buttons">
                <Link to="/check-eligibility" className="check-btn">
                  Check My Eligibility →
                </Link>
                <Link to="/scholarships" className="browse-btn">
                  Browse Scholarships
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="image-box">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90"
                  alt="Students studying"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section">
        <div className="container">
          <div className="row g-3">
            {[
              [total, "Scholarships Listed"],
              [govt || "0", "🏛️ Government"],
              [priv || "0", "🏢 Private"],
              ["⚙️", "Rule-Based Matching"]
            ].map(([num, text]) => (
              <div className="col-md-3" key={text}>
                <div className="card text-center">
                  <h2>{num}</h2>
                  <p className="mb-0">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div className="row g-3">
            {[
              ["🎯","Personalized Matches","Find scholarships that fit your profile."],
              ["📝","Simple Form","Enter your details once to check eligibility."],
              ["🔎","More Opportunities","Explore multiple scholarships in one place."],
              ["📊","Clear Results","Understand why you qualify or don't qualify."]
            ].map(([icon,title,text]) => (
              <div className="col-md-3" key={title}>
                <div className="card">
                  <h3>{icon}</h3>
                  <h5>{title}</h5>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section className="section">
        <div className="container">
          <h2>Top Scholarships</h2>
          <div className="row g-4 mt-2">
            {scholarships.map((s,i) => (
              <div className="col-md-4" key={i}>
                <div className="photo-card">
                  <img src={photos[i]} alt={s[0]} />
                  <div className="photo-content">
                    <h5>{s[0]}</h5>
                    <small>{s[1]}</small>
                    <h6 className="mt-2">{s[2]}</h6>
                    <p>Check eligibility and application details.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories">
        <div className="container">
          <h2>Scholarships for Everyone</h2>
          <div className="row g-3 mt-3">
            {["🏛️ Government","🏢 Private","🎯 Merit-Based",
              "🤝 Need-Based","👩‍🎓 Women in STEM","🛠️ Technical"].map(x => (
              <div className="col-6 col-md-4" key={x}>
                <div className="card">{x}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">How It Works</h2>
          <div className="row g-3 mt-3">
            {[
              ["01","Share Your Information","Provide your academic and personal details."],
              ["02","Find Your Matches","Our system compares your details with scholarships."],
              ["03","Apply With Confidence","Review suitable opportunities and apply."]
            ].map(([num,title,text]) => (
              <div className="col-md-4" key={num}>
                <div className="card">
                  <div className="step">{num}</div>
                  <h5 className="mt-3">{title}</h5>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;