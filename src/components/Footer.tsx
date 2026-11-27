import { Scale, Shield, Copy, AlertTriangle, Cookie, Mail, TrendingUp } from 'lucide-react';
import type { LegalSection } from './LegalModal';

interface FooterProps {
  onOpenSection: (section: LegalSection) => void;
}

interface FooterLink {
  section: LegalSection;
  icon: typeof Scale;
  label: string;
}

const LINKS: FooterLink[] = [
  { section: 'terms', icon: Scale, label: 'Terms & Conditions' },
  { section: 'privacy', icon: Shield, label: 'Privacy Policy' },
  { section: 'copyright', icon: Copy, label: 'Copyright' },
  { section: 'responsible', icon: AlertTriangle, label: 'Responsible Gaming' },
  { section: 'cookies', icon: Cookie, label: 'Cookies' },
  { section: 'contact', icon: Mail, label: 'Legal Notices' },
];

export function Footer({ onOpenSection }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                Poker Bankroll Dashboard
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A personal poker session recording and statistical analysis tool.
              It does not facilitate or promote gambling.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Operated from Portugal · Subject to Portuguese law
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.section}
                  onClick={() => onOpenSection(link.section)}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Poker Bankroll Dashboard. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            18+ · Play responsibly · Support: Gamblers Anonymous Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
