import { useEffect } from 'react';
import { X, Scale, Shield, Copy, AlertTriangle, Cookie, Mail } from 'lucide-react';

export type LegalSection =
  | 'terms'
  | 'privacy'
  | 'copyright'
  | 'responsible'
  | 'cookies'
  | 'contact';

interface LegalModalProps {
  section: LegalSection | null;
  onClose: () => void;
}

interface SectionMeta {
  icon: typeof Scale;
  title: string;
  subtitle: string;
  lastUpdated: string;
}

const SECTION_META: Record<LegalSection, SectionMeta> = {
  terms: {
    icon: Scale,
    title: 'Terms & Conditions',
    subtitle: 'Terms of Use of the Service',
    lastUpdated: '27 November 2026',
  },
  privacy: {
    icon: Shield,
    title: 'Privacy Policy',
    subtitle: 'Personal Data Processing',
    lastUpdated: '27 November 2026',
  },
  copyright: {
    icon: Copy,
    title: 'Copyright Notice',
    subtitle: 'Intellectual Property',
    lastUpdated: '27 November 2026',
  },
  responsible: {
    icon: AlertTriangle,
    title: 'Responsible Gaming',
    subtitle: 'Commitment & Support Resources',
    lastUpdated: '27 November 2026',
  },
  cookies: {
    icon: Cookie,
    title: 'Cookies Policy',
    subtitle: 'Use of Cookies',
    lastUpdated: '27 November 2026',
  },
  contact: {
    icon: Mail,
    title: 'Legal Notices & Contact',
    subtitle: 'Operating Entity & Communications',
    lastUpdated: '27 November 2026',
  },
};

function TermHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-2">
      {children}
    </h3>
  );
}

function TermParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
      {children}
    </p>
  );
}

function TermList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function TermsContent() {
  return (
    <div>
      <TermParagraph>
        Welcome to Poker Bankroll Dashboard. By accessing or using this
        platform, you agree to these Terms & Conditions. If you do not agree
        with any part of these terms, you should stop using the service
        immediately.
      </TermParagraph>

      <TermHeading>1. Acceptance of Terms</TermHeading>
      <TermParagraph>
        Use of the Poker Bankroll Dashboard implies full and unreserved
        acceptance of these Terms & Conditions, in accordance with the general
        regime of contractual obligations under Portuguese civil law (Articles
        226 et seq. of the Portuguese Civil Code).
      </TermParagraph>

      <TermHeading>2. Definition of the Service</TermHeading>
      <TermParagraph>
        Poker Bankroll Dashboard is a recording and statistical analysis tool
        intended exclusively for personal tracking of poker session results.
        The platform does not organise, promote, or facilitate gambling or
        financial wagering, nor does it process monetary transactions between
        users.
      </TermParagraph>

      <TermHeading>3. Eligibility</TermHeading>
      <TermList
        items={[
          'You represent that you are at least 18 years of age (age of legal majority in Portugal, under Article 122 of the Civil Code).',
          'Use by minors is strictly prohibited.',
          'You represent that all information you provide is true, complete, and up to date.',
        ]}
      />

      <TermHeading>4. User Account</TermHeading>
      <TermList
        items={[
          'You are responsible for maintaining the confidentiality of your login credentials.',
          'All activity carried out from your account is your sole responsibility.',
          'You agree to immediately notify us of any unauthorised use of your account.',
          'We reserve the right to suspend or close accounts that breach these terms.',
        ]}
      />

      <TermHeading>5. Acceptable Use</TermHeading>
      <TermParagraph>You agree not to:</TermParagraph>
      <TermList
        items={[
          'Use the platform for unlawful purposes, including activities criminalised under Portuguese Law No. 4/2015 of 12 January (illegal gambling offence in Portugal).',
          'Improperly access other users\u2019 data or attempt to compromise system security.',
          'Introduce defamatory, offensive content or content that infringes the rights of third parties.',
          'Use automated collection techniques (scraping, bots) without express authorisation.',
        ]}
      />

      <TermHeading>6. Intellectual Property</TermHeading>
      <TermParagraph>
        All elements of the platform — design, code, graphics, logos, and
        trademarks — are protected by copyright under the Portuguese Code of
        Copyright and Related Rights (approved by Decree-Law No. 122/2017 of
        9 October) and applicable EU legislation. Reproduction, in whole or in
        part, is prohibited without prior written authorisation.
      </TermParagraph>

      <TermHeading>7. Limitation of Liability</TermHeading>
      <TermParagraph>
        The platform is provided "as is", without warranties of any kind,
        express or implied. We assume no responsibility for: (a) service
        interruptions; (b) loss of data or profits; (c) gambling decisions
        made on the basis of the information presented; (d) inaccuracies in the
        statistical calculations shown.
      </TermParagraph>

      <TermHeading>8. Changes to the Terms</TermHeading>
      <TermParagraph>
        We reserve the right to update these Terms at any time. Changes take
        effect upon publication on this page. Continued use of the service
        after publication constitutes acceptance of the amended terms.
      </TermParagraph>

      <TermHeading>9. Governing Law and Dispute Resolution</TermHeading>
      <TermParagraph>
        These Terms are governed by Portuguese law. Any dispute shall be
        resolved by the courts of the judicial district of Lisbon, without
        prejudice to mandatory rules on jurisdiction and alternative consumer
        dispute resolution under Portuguese Law No. 144/2015 of 8 September.
        For consumer complaints, you may resort to the Lisbon Consumer Dispute
        Arbitration Centre (CNIACC — www.cniacc.pt).
      </TermParagraph>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div>
      <TermParagraph>
        This Privacy Policy describes how Poker Bankroll Dashboard collects,
        processes, and protects its users\u2019 personal data, in strict
        compliance with the General Data Protection Regulation (GDPR —
        Regulation (EU) 2016/679) and Portuguese Law No. 58/2019 of 8 August,
        which ensures its implementation in Portugal.
      </TermParagraph>

      <TermHeading>1. Data Controller</TermHeading>
      <TermParagraph>
        The data controller is the operating entity of Poker Bankroll
        Dashboard, whose contact details are set out in the "Legal Notices &
        Contact" section.
      </TermParagraph>

      <TermHeading>2. Data Collected</TermHeading>
      <TermList
        items={[
          'Identification data: email address (used for authentication).',
          'Usage data: poker sessions logged, amounts, dates, and platforms indicated by the user.',
          'Technical data: IP address and access metadata, temporary in nature and for security purposes.',
        ]}
      />

      <TermHeading>3. Purposes and Legal Bases</TermHeading>
      <TermList
        items={[
          'Provision of the service (Article 6(1)(b) GDPR) — performance of a contract.',
          'Compliance with legal obligations (Article 6(1)(c) GDPR).',
          'Improvement and security of the platform (Article 6(1)(f) GDPR — legitimate interest).',
        ]}
      />

      <TermHeading>4. Retention Periods</TermHeading>
      <TermParagraph>
        Data is retained for the period strictly necessary for the purposes
        described. Poker session data is kept while the account is active and
        deleted within a maximum of 30 days after an account closure request,
        unless a legal obligation requires otherwise.
      </TermParagraph>

      <TermHeading>5. Data Subject Rights</TermHeading>
      <TermParagraph>Under the GDPR, you are entitled to:</TermParagraph>
      <TermList
        items={[
          'Right of access to your data (Article 15).',
          'Right to rectification of inaccurate data (Article 16).',
          'Right to erasure ("right to be forgotten", Article 17).',
          'Right to restriction of processing (Article 18).',
          'Right to data portability (Article 20).',
          'Right to object to processing (Article 21).',
          'Right not to be subject to automated decisions (Article 22).',
        ]}
      />
      <TermParagraph>
        To exercise these rights, please submit a written request using the
        contact details in the relevant section. We will respond within a
        maximum of 30 days.
      </TermParagraph>

      <TermHeading>6. Supervisory Authority</TermHeading>
      <TermParagraph>
        Without prejudice to any other administrative or judicial remedy, you
        have the right to lodge a complaint with the Portuguese Data Protection
        Authority (Comissão Nacional de Proteção de Dados — CNPD), the
        competent authority in Portugal, located at Av. Brasília, no. 14,
        1350-012 Lisbon, or via www.cnpd.pt.
      </TermParagraph>

      <TermHeading>7. Processors (Subcontractors)</TermHeading>
      <TermParagraph>
        To provide the service, we rely on processors (e.g. cloud
        infrastructure and authentication providers) who are contractually
        bound to confidentiality and security guarantees equivalent to those
        required by the GDPR.
      </TermParagraph>
    </div>
  );
}

function CopyrightContent() {
  return (
    <div>
      <TermParagraph>
        All elements comprising the Poker Bankroll Dashboard platform —
        including, without limitation, the source code, graphic design,
        interfaces, logos, trademarks, texts, and the selection and
        arrangement of content — are protected by copyright and related rights
        under the Portuguese Code of Copyright and Related Rights (Decree-Law
        No. 122/2017 of 9 October) and relevant EU directives.
      </TermParagraph>

      <TermHeading>1. Ownership</TermHeading>
      <TermParagraph>
        Ownership of the copyright in the platform belongs to the operating
        entity of Poker Bankroll Dashboard. Users are granted a personal,
        non-exclusive, non-transferable, and revocable right of use, limited
        to accessing and using the platform in accordance with the Terms &
        Conditions.
      </TermParagraph>

      <TermHeading>2. Permitted Uses</TermHeading>
      <TermList
        items={[
          'Use of the platform for personal, non-commercial purposes.',
          'Temporary reproduction of content on the user\u2019s device, strictly necessary for technical operation (Article 75 of the Code of Copyright and Related Rights).',
        ]}
      />

      <TermHeading>3. Prohibited Uses</TermHeading>
      <TermList
        items={[
          'Reproduction, distribution, public communication, or transformation, in whole or in part, without prior written authorisation (Articles 64 and 68 of the Code of Copyright and Related Rights).',
          'Extraction and/or reutilisation of the database, under Article 108 et seq. of the same Code.',
          'Removal or alteration of copyright or trademark notices.',
        ]}
      />

      <TermHeading>4. Third-Party Trademarks and Elements</TermHeading>
      <TermParagraph>
        Any trademarks, logos, or designations of third parties that may be
        referred to on the platform (e.g. poker room names) belong to their
        respective holders and are used solely for identification purposes,
        implying no affiliation, sponsorship, or endorsement. Their use by
        third parties is subject to the authorisation of the respective
        holders.
      </TermParagraph>

      <TermHeading>5. Penalties</TermHeading>
      <TermParagraph>
        Infringement of copyright may result in civil sanctions (compensation
        — Article 323 et seq. of the Code of Copyright and Related Rights) and
        criminal sanctions (provided for in Article 324 of the same Code),
        without prejudice to the precautionary and supervisory measures taken
        by the General Inspectorate for Cultural Activities (IGAC).
      </TermParagraph>
    </div>
  );
}

function ResponsibleContent() {
  return (
    <div>
      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            Poker involves financial risk. Always play responsibly. If gambling
            stops being entertainment and becomes a need, seek professional
            help.
          </p>
        </div>
      </div>

      <TermHeading>1. Platform Commitment</TermHeading>
      <TermParagraph>
        Poker Bankroll Dashboard is a statistical tracking tool. It does not
        promote or encourage the practice of gambling, nor does it facilitate
        participation in real-money poker games. The information presented is
        intended exclusively for self-recording and performance analysis by the
        user.
      </TermParagraph>

      <TermHeading>2. Legal Framework in Portugal</TermHeading>
      <TermParagraph>
        The operation of and participation in gambling in Portugal is regulated
        by Law No. 4/2015 of 12 January and supervised by the Gambling
        Regulation and Inspection Service (SRIJ —
        www.srij.turismodeportugal.pt). Only entities licensed by the SRIJ are
        authorised to operate online gambling in Portugal. Participation in
        illegal gambling is a criminal offence (Article 8 of Law No. 4/2015).
      </TermParagraph>

      <TermHeading>3. Support Resources in Portugal</TermHeading>
      <TermParagraph>
        If you feel you may have a gambling problem, the following resources
        can help:
      </TermParagraph>
      <TermList
        items={[
          'SRIJ — Gambling Regulation and Inspection Service: www.srij.turismodeportugal.pt',
          'Gamblers Anonymous Portugal (Jogadores Anónimos): www.jogadoresanonimos.pt',
          'SNS 24 — Mental Health Support Line (Portugal): 808 24 24 24',
          'Voz de Apoio — Psychological Support Helpline: 213 545 480 (part of SOS Voz de Apoio).',
        ]}
      />

      <TermHeading>4. Self-Limitation and Self-Exclusion</TermHeading>
      <TermList
        items={[
          'Set a fixed budget for your sessions and never exceed it.',
          'Establish time limits for playing.',
          'Do not gamble with money you cannot afford to lose.',
          'Reflect on the reasons that lead you to play.',
          'Seek support if you find it difficult to stop.',
        ]}
      />

      <TermHeading>5. Important Notice</TermHeading>
      <TermParagraph>
        Gambling can be addictive. Loss of control over gambling is a
        recognised disorder (gambling disorder, classified in the ICD-11 by
        the World Health Organization). Acknowledging the problem is the first
        step towards solving it.
      </TermParagraph>
    </div>
  );
}

function CookiesContent() {
  return (
    <div>
      <TermParagraph>
        This policy describes the cookies and similar technologies used by
        Poker Bankroll Dashboard, in accordance with the General Data
        Protection Regulation (GDPR), Portuguese Law No. 58/2019, and the
        guidelines of the Portuguese Data Protection Authority (CNPD).
      </TermParagraph>

      <TermHeading>1. What Are Cookies</TermHeading>
      <TermParagraph>
        Cookies are small text files stored on the user\u2019s device that
        allow the device to be recognised and to remember preferences,
        sessions, and browsing behaviour.
      </TermParagraph>

      <TermHeading>2. Cookies Used</TermHeading>
      <TermList
        items={[
          'Essential cookies: necessary for the basic functioning of the platform (authentication and session). No prior consent required.',
          'Preference cookies: remember user choices (e.g. light/dark mode). Require consent.',
          'Analytical cookies: enable aggregated and anonymous measurement of usage, for service improvement purposes. Require consent.',
        ]}
      />

      <TermHeading>3. Managing Cookies</TermHeading>
      <TermParagraph>
        You may at any time manage or delete cookies through your browser
        settings. Disabling essential cookies may, however, affect the
        functioning of the platform.
      </TermParagraph>

      <TermHeading>4. Withdrawing Consent</TermHeading>
      <TermParagraph>
        Consent for non-essential cookies may be withdrawn at any time, with
        immediate effect, through your browser preferences or the management
        mechanism provided on the platform.
      </TermParagraph>
    </div>
  );
}

function ContactContent() {
  return (
    <div>
      <TermHeading>Operating Entity</TermHeading>
      <TermParagraph>
        Poker Bankroll Dashboard is a personal and informational poker session
        recording and statistical analysis service, operated by a private-law
        entity not subject to licensing by the Gambling Regulation and
        Inspection Service (SRIJ), as it does not organise or facilitate
        gambling.
      </TermParagraph>

      <TermHeading>Address for Communications</TermHeading>
      <TermList
        items={[
          'Poker Bankroll Dashboard',
          'Lisbon, Portugal',
          'Email: contact@pokerbankroll.pt',
        ]}
      />

      <TermHeading>VAT Number and Registration</TermHeading>
      <TermParagraph>
        The VAT number (NIF) and other tax identification details of the
        operating entity may be requested in writing at the email address
        indicated above.
      </TermParagraph>

      <TermHeading>Complaints</TermHeading>
      <TermParagraph>
        Complaints should be submitted in writing to the email address above.
        In the absence of a satisfactory response, you may resort to the
        alternative consumer dispute resolution mechanisms provided for under
        Portuguese Law No. 144/2015 of 8 September, in particular the Consumer
        Dispute Arbitration Centre (CNIACC — www.cniacc.pt).
      </TermParagraph>

      <TermHeading>Supervisory Authorities</TermHeading>
      <TermList
        items={[
          'CNPD — Portuguese Data Protection Authority: www.cnpd.pt (personal data protection).',
          'SRIJ — Gambling Regulation and Inspection Service: www.srij.turismodeportugal.pt (gambling and betting in Portugal).',
          'IGAC — General Inspectorate for Cultural Activities: www.igac.gov.pt (copyright).',
        ]}
      />
    </div>
  );
}

function SectionContent({ section }: { section: LegalSection }) {
  switch (section) {
    case 'terms':
      return <TermsContent />;
    case 'privacy':
      return <PrivacyContent />;
    case 'copyright':
      return <CopyrightContent />;
    case 'responsible':
      return <ResponsibleContent />;
    case 'cookies':
      return <CookiesContent />;
    case 'contact':
      return <ContactContent />;
  }
}

export function LegalModal({ section, onClose }: LegalModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (section) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [section, onClose]);

  if (!section) return null;

  const meta = SECTION_META[section];
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {meta.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {meta.subtitle} · Last updated {meta.lastUpdated}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <SectionContent section={section} />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
