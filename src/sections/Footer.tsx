const Footer = () => (
  <footer className="border-t border-dashboard-border">
    <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-terminal-muted">
      <span>© {new Date().getFullYear()} Satya Prakash Chelluri</span>
      <span className="flex gap-5">
        <a href="https://www.linkedin.com/in/prakashchelluri" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green">LinkedIn</a>
        <a href="https://github.com/prakashchelluri" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green">GitHub</a>
        <a href="#hero" className="hover:text-neon-green">Back to top</a>
      </span>
    </div>
  </footer>
);

export default Footer;
