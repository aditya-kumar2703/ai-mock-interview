import Logo from '../shared/Logo';
import { Mail, Globe, Link as LinkIcon } from 'lucide-react';

/**
 * Rich Footer component for the landing page.
 */
export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Logo size="md" className="mb-4" />
            <p className="text-sm text-surface-400 mb-6 leading-relaxed">
              The next generation AI-powered interview practice platform. Prepare smarter, land your dream job faster.
            </p>
            <div className="flex items-center gap-4 text-surface-400">
              <a href="#" className="hover:text-primary-400 transition-default"><Globe size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-default"><LinkIcon size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-default"><Mail size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-semibold text-surface-100 mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Features</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Pricing</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Use Cases</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-100 mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Blog</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Interview Guides</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Documentation</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-100 mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">About Us</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Careers</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-default">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} AMIE — AI Mock Interview Ecosystem. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-500"></span>
            <span className="text-xs text-surface-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
