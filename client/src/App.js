import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/work/*" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Header() {
  return (
    <header className="container">
      <h1>Your Name</h1>
      <p>Data Scientist | Developer | Fintech Enthusiast</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About Me</Link>
        <Link to="/education">Education</Link>
        <Link to="/experience">Experience</Link>
        <Link to="/certifications">Certifications</Link>
        <Link to="/work">Work</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <section id="hero" className="container">
      <h2>Welcome to My Portfolio</h2>
      <p>Showcasing my journey through data science, fintech, and beyond.</p>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="container">
      <h2>About Me</h2>
      <p>I am a data scientist and developer with a passion for fintech, problem-solving, and technology-driven solutions.</p>
    </section>
  );
}

function Education() {
  return (
    <section className="container">
      <h2>Education</h2>
      <p>Details about educational background go here.</p>
    </section>
  );
}

function Experience() {
  return (
    <section className="container">
      <h2>Experience</h2>
      <p>Details about work experience go here.</p>
    </section>
  );
}

function Certifications() {
  return (
    <section className="container">
      <h2>Certifications</h2>
      <p>List of relevant certifications.</p>
    </section>
  );
}

function Work() {
  return (
    <section className="container">
      <h2>Work</h2>
      <div>
        <h3>Analyses</h3>
        <p>Details about data analyses projects.</p>
      </div>
      <div>
        <h3>Machine Learning</h3>
        <p>Machine learning portfolio.</p>
      </div>
      <div>
        <h3>Natural Language Processing</h3>
        <p>NLP-related projects.</p>
      </div>
      <div>
        <h3>Software Engineering</h3>
        <p>Software engineering projects.</p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="container">
      <h2>Contact</h2>
      <p>Let's collaborate! Reach me at:</p>
      <ul>
        <li><a href="#">LinkedIn</a></li>
        <li><a href="#">GitHub</a></li>
        <li><a href="mailto:youremail@example.com">Email Me</a></li>
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2025 Your Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;