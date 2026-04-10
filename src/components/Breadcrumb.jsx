import { Link } from 'react-router-dom';

export default function Breadcrumb({ to, label }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm no-underline mb-5 group transition-colors">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
