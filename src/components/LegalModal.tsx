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
    title: 'Termos e Condições',
    subtitle: 'Termos de Utilização do Serviço',
    lastUpdated: '27 de novembro de 2026',
  },
  privacy: {
    icon: Shield,
    title: 'Política de Privacidade',
    subtitle: 'Tratamento de Dados Pessoais',
    lastUpdated: '27 de novembro de 2026',
  },
  copyright: {
    icon: Copy,
    title: 'Aviso de Direitos de Autor',
    subtitle: 'Propriedade Intelectual',
    lastUpdated: '27 de novembro de 2026',
  },
  responsible: {
    icon: AlertTriangle,
    title: 'Jogo Responsável',
    subtitle: 'Compromisso e Recursos de Apoio',
    lastUpdated: '27 de novembro de 2026',
  },
  cookies: {
    icon: Cookie,
    title: 'Política de Cookies',
    subtitle: 'Utilização de Cookies',
    lastUpdated: '27 de novembro de 2026',
  },
  contact: {
    icon: Mail,
    title: 'Contactos e Avisos Legais',
    subtitle: 'Entidade Gestora e Comunicações',
    lastUpdated: '27 de novembro de 2026',
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
        Bem-vindo ao Poker Bankroll Dashboard. Ao aceder ou utilizar esta
        plataforma, concorda com os presentes Termos e Condições. Caso não
        concorde com qualquer parte destes termos, deverá deixar de utilizar o
        serviço imediatamente.
      </TermParagraph>

      <TermHeading>1. Aceitação dos Termos</TermHeading>
      <TermParagraph>
        A utilização do Poker Bankroll Dashboard implica a aceitação integral e
        sem reservas dos presentes Termos e Condições, conforme previsto no
        regime geral das obrigações contratuais e nos artigos 226.º e seguintes
        do Código Civil português.
      </TermParagraph>

      <TermHeading>2. Definição do Serviço</TermHeading>
      <TermParagraph>
        O Poker Bankroll Dashboard é uma ferramenta de registo e análise
        estatística destinada exclusivamente a fins de acompanhamento pessoal
        de resultados de sessões de poker. A plataforma não organiza, promove,
        nem facilita jogos de azar nem apostas financeiras, nem processa
        transações monetárias entre utilizadores.
      </TermParagraph>

      <TermHeading>3. Elegibilidade</TermHeading>
      <TermList
        items={[
          'O utilizador declara ter, no mínimo, 18 anos de idade (maioridade civil em Portugal, conforme o artigo.º 122.º do Código Civil).',
          'A utilização por menores de idade é estritamente proibida.',
          'O utilizador declara que toda a informação fornecida é verdadeira, completa e atualizada.',
        ]}
      />

      <TermHeading>4. Conta de Utilizador</TermHeading>
      <TermList
        items={[
          'O utilizador é responsável pela confidencialidade das suas credenciais de acesso.',
          'Toda a atividade realizada a partir da sua conta é da sua inteira responsabilidade.',
          'O utilizador compromete-se a comunicar de imediato qualquer utilização não autorizada da sua conta.',
          'A entidade gestora reserva-se o direito de suspender ou encerrar contas que violem os presentes termos.',
        ]}
      />

      <TermHeading>5. Utilização Aceitável</TermHeading>
      <TermParagraph>O utilizador compromete-se a não:</TermParagraph>
      <TermList
        items={[
          'Utilizar a plataforma para fins ilegais, nomeadamente atividades previstas e punidas pela Lei n.º 4/2015, de 12 de janeiro (crime de jogo ilegal em Portugal).',
          'Aceder de forma indevida a dados de outros utilizadores ou tentar comprometer a segurança do sistema.',
          'Introduzir conteúdos difamatórios, ofensivos ou que infrinjam direitos de terceiros.',
          'Utilizar técnicas de recolha automatizada (scraping, bots) sem autorização expressa.',
        ]}
      />

      <TermHeading>6. Propriedade Intelectual</TermHeading>
      <TermParagraph>
        Todos os elementos da plataforma — design, código, gráficos, logótipos e
        marcas — são protegidos por direitos de autor nos termos do Código do
        Direito de Autor e dos Direitos Conexos (aprovado pelo Decreto-Lei
        n.º 122/2017, de 9 de outubro) e pela legislação comunitária aplicável.
        É proibida a reprodução, total ou parcial, sem autorização prévia e por
        escrito.
      </TermParagraph>

      <TermHeading>7. Limitação de Responsabilidade</TermHeading>
      <TermParagraph>
        A plataforma é fornecida "tal como está", sem garantias de qualquer
        espécie, expressas ou implícitas. A entidade gestora não assume
        responsabilidade por: (a) interrupções do serviço; (b) perda de dados
        ou de lucros; (c) decisões de jogo tomadas com base na informação
        apresentada; (d) imprecisões nos cálculos estatísticos apresentados.
      </TermParagraph>

      <TermHeading>8. Alterações aos Termos</TermHeading>
      <TermParagraph>
        A entidade gestora reserva-se o direito de atualizar os presentes
        Termos a qualquer momento. As alterações produzem efeitos a partir da
        sua publicação nesta página. A utilização continuada do serviço após
        a publicação equivale à aceitação dos termos alterados.
      </TermParagraph>

      <TermHeading>9. Lei Aplicável e Resolução de Litígios</TermHeading>
      <TermParagraph>
        Os presentes Termos regem-se pelo direito português. Qualquer litígio
        será dirimido pelos Tribunais da Comarca de Lisboa, sem prejuízo das
        normas imperativas aplicáveis em matéria de competência judiciária e
        de resolução alternativa de litígios de consumo, nos termos da Lei
        n.º 144/2015, de 8 de setembro. Para reclamações de consumo, poderá
        recorrer ao Centro de Arbitragem de Conflitos de Consumo de Lisboa
        (CNIACC — www.cniacc.pt).
      </TermParagraph>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div>
      <TermParagraph>
        A presente Política de Privacidade descreve a forma como o Poker
        Bankroll Dashboard recolhe, trata e protege os dados pessoais dos seus
        utilizadores, em estrito cumprimento do Regulamento Geral de Proteção
        de Dados (RGPD — Regulamento (UE) 2016/679) e da Lei n.º 58/2019, de
        8 de agosto, que assegura a sua execução em Portugal.
      </TermParagraph>

      <TermHeading>1. Responsável pelo Tratamento</TermHeading>
      <TermParagraph>
        O responsável pelo tratamento dos dados é a entidade gestora do Poker
        Bankroll Dashboard, cujos contactos constam da secção "Contactos e
        Avisos Legais".
      </TermParagraph>

      <TermHeading>2. Dados Recolhidos</TermHeading>
      <TermList
        items={[
          'Dados de identificação: endereço de email (utilizado para autenticação).',
          'Dados de utilização: sessões de poker registadas, valores, datas e plataformas indicadas pelo utilizador.',
          'Dados técnicos: endereço IP e metadados de acesso, com caráter temporário e para fins de segurança.',
        ]}
      />

      <TermHeading>3. Finalidades e Bases Legais</TermHeading>
      <TermList
        items={[
          'Prestação do serviço (art.º 6.º, n.º 1, alínea b) do RGPD) — execução de contrato.',
          'Cumprimento de obrigações legais (art.º 6.º, n.º 1, alínea c) do RGPD).',
          'Melhoria e segurança da plataforma (art.º 6.º, n.º 1, alínea f) do RGPD — interesse legítimo).',
        ]}
      />

      <TermHeading>4. Períodos de Conservação</TermHeading>
      <TermParagraph>
        Os dados são conservados durante o período estritamente necessário às
        finalidades descritas. Os dados de sessões de poker são mantidos
        enquanto a conta estiver ativa e eliminados no prazo máximo de 30 dias
        após o pedido de encerramento da conta, salvo obrigitação legal em
        contrário.
      </TermParagraph>

      <TermHeading>5. Direitos do Titular dos Dados</TermHeading>
      <TermParagraph>Nos termos do RGPD, o utilizador dispõe de:</TermParagraph>
      <TermList
        items={[
          'Direito de acesso aos dados (art.º 15.º).',
          'Direito de retificação de dados inexatos (art.º 16.º).',
          'Direito ao apagamento ("direito a ser esquecido", art.º 17.º).',
          'Direito à limitação do tratamento (art.º 18.º).',
          'Direito à portabilidade dos dados (art.º 20.º).',
          'Direito de oposição ao tratamento (art.º 21.º).',
          'Direito de não ser sujeito a decisões automatizadas (art.º 22.º).',
        ]}
      />
      <TermParagraph>
        Para exercer estes direitos, o utilizador deverá enviar um pedido por
        escrito através dos contactos indicados na secção respetiva. A entidade
        gestora responderá no prazo máximo de 30 dias.
      </TermParagraph>

      <TermHeading>6. Autoridade de Controlo</TermHeading>
      <TermParagraph>
        Sem prejuízo de qualquer outro recurso administrativo ou judicial, o
        utilizador tem o direito de apresentar reclamação junto da Comissão
        Nacional de Proteção de Dados (CNPD), entidade competente em Portugal,
        com sede na Av. Brasília, n.º 14, 1350-012 Lisboa, ou através do site
        www.cnpd.pt.
      </TermParagraph>

      <TermHeading>7. Subcontratantes (Processadores)</TermHeading>
      <TermParagraph>
        Para a prestação do serviço, são utilizados subcontratantes que atuam
        como responsáveis pelo tratamento (ex.: prestadores de infraestrutura
        cloud e de autenticação), estando vinculados contratualmente a garantias
        de confidencialidade e segurança equivalentes às exigidas pelo RGPD.
      </TermParagraph>
    </div>
  );
}

function CopyrightContent() {
  return (
    <div>
      <TermParagraph>
        Todos os elementos integrantes da plataforma Poker Bankroll Dashboard —
        incluindo, de forma não exaustiva, o código fonte, o design gráfico, as
        interfaces, os logótipos, as marcas, os textos e a seleção e disposição
        dos conteúdos — são protegidos por direitos de autor e direitos
        conexos, nos termos do Código do Direito de Autor e dos Direitos
        Conexos (Decreto-Lei n.º 122/2017, de 9 de outubro) e das diretivas
        comunitárias relevantes.
      </TermParagraph>

      <TermHeading>1. Titularidade</TermHeading>
      <TermParagraph>
        A titularidade dos direitos de autor sobre a plataforma pertence à
        entidade gestora do Poker Bankroll Dashboard. Aos utilizadores é
        concedido um direito de utilização pessoal, não exclusivo, intransmissível
        e revogável, limitado ao acesso e utilização da plataforma em
        conformidade com os Termos e Condições.
      </TermParagraph>

      <TermHeading>2. Utilizações Permitidas</TermHeading>
      <TermList
        items={[
          'Utilização da plataforma para fins pessoais e não comerciais.',
          'Reprodução temporária dos conteúdos no dispositivo do utilizador, estritamente necessária ao funcionamento técnico (art.º 75.º do Código do Direito de Autor).',
        ]}
      />

      <TermHeading>3. Utilizações Proibidas</TermHeading>
      <TermList
        items={[
          'Reprodução, distribuição, comunicação pública ou transformação, total ou parcial, sem autorização prévia e por escrito (art.º 64.º e 68.º do Código do Direito de Autor).',
          'Extração e/ou reutilização da base de dados, nos termos do art.º 108.º e seguintes do mesmo diploma.',
          'Remoção ou alteração de menções relativas aos direitos de autor ou de marca.',
        ]}
      />

      <TermHeading>4. Marcas e Elementos de Terceiros</TermHeading>
      <TermParagraph>
        Quaisquer marcas, logótipos ou designações de terceiros eventualmente
        referidos na plataforma (ex.: nomes de salas de poker) pertencem aos
        respetivos titulares e são utilizados apenas para fins identificativos,
        não implicando qualquer afiliação, patrocínio ou endosso. A sua
        utilização por terceiros está sujeita à autorização dos respetivos
        titulares.
      </TermParagraph>

      <TermHeading>5. Sanções</TermHeading>
      <TermParagraph>
        A violação dos direitos de autor pode determinar a aplicação de sanções
        cíveis (indemnização — art.º 323.º e seguintes do Código do Direito de
        Autor) e criminais (previstas no art.º 324.º do mesmo diploma), sem
        prejuízo das medidas cautelares e de Fiscalização adotadas pela
        Inspeção-Geral das Atividades Culturais (IGAC).
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
            O poker envolve riscos financeiros. Jogue sempre de forma
            responsável. Se o jogo deixar de ser uma forma de entretenimento e
            se tornar uma necessidade, procure ajuda especializada.
          </p>
        </div>
      </div>

      <TermHeading>1. Compromisso da Plataforma</TermHeading>
      <TermParagraph>
        O Poker Bankroll Dashboard é uma ferramenta de acompanhamento
        estatístico. Não promove, nem incentiva a prática de jogos de azar,
        nem facilita a participação em jogos de poker com dinheiro real.
        A informação apresentada destina-se exclusivamente ao auto-registo
        e à análise de desempenho pelo próprio utilizador.
      </TermParagraph>

      <TermHeading>2. Quadro Legal em Portugal</TermHeading>
      <TermParagraph>
        A exploração e participação em jogos de azar em Portugal são reguladas
        pela Lei n.º 4/2015, de 12 de janeiro, e supervisionadas pelo Serviço
        de Regulação e Inspeção de Jogos do Turismo de Portugal (SRIJ —
        www.srij.turismodeportugal.pt). Apenas as entidades licenciadas pelo
        SRIJ estão autorizadas a explorar jogos de azar em regime online. A
        participação em jogos ilegais constitui crime (art.º 8.º da
        Lei n.º 4/2015).
      </TermParagraph>

      <TermHeading>3. Recursos de Apoio em Portugal</TermHeading>
      <TermParagraph>
        Se considera que pode ter um problema com o jogo, os seguintes recursos
        podem ajudar:
      </TermParagraph>
      <TermList
        items={[
          'SRIJ — Serviço de Regulação e Inspeção de Jogos: www.srij.turismodeportugal.pt',
          'Linha de Apoio ao Jogador Compulsivo (Jogadores Anónimos Portugal): www.jogadoresanonimos.pt',
          'SNS 24 — Linha de Apoio à Saúde Mental: 808 24 24 24',
          'Voz de Apoio — Linha Telefone de Apoio: 213 545 480 (linha de apoio psicológico, integrada na SOS Voz de Apoio).',
        ]}
      />

      <TermHeading>4. Autolimitação e Autoexclusão</TermHeading>
      <TermList
        items={[
          'Defina um orçamento fixo para as suas sessões e não o ultrapasse.',
          'Estabeleça limites de tempo para jogar.',
          'Não jogue com dinheiro que não pode perder.',
          'Reflita sobre os motivos que o levam a jogar.',
          'Procure apoio se sentir dificuldade em parar.',
        ]}
      />

      <TermHeading>5. Aviso Importante</TermHeading>
      <TermParagraph>
        O jogo pode ser viciante. A perda de controlo sobre o jogo é uma
        perturbação reconhecida pela Organização Mundial de Saúde (perturbação
        do jogo, classificada na CID-11). Reconhecer o problema é o primeiro
        passo para o resolver.
      </TermParagraph>
    </div>
  );
}

function CookiesContent() {
  return (
    <div>
      <TermParagraph>
        A presente política descreve os cookies e tecnologias similares
        utilizados pelo Poker Bankroll Dashboard, em conformidade com o
        Regulamento Geral de Proteção de Dados (RGPD), a Lei n.º 58/2019 e as
        orientações da Comissão Nacional de Proteção de Dados (CNPD).
      </TermParagraph>

      <TermHeading>1. O que são Cookies</TermHeading>
      <TermParagraph>
        Cookies são pequenos ficheiros de texto armazenados no dispositivo do
        utilizador que permitem reconhecer o dispositivo e memorizar
        preferências, sessões e comportamentos de navegação.
      </TermParagraph>

      <TermHeading>2. Cookies Utilizados</TermHeading>
      <TermList
        items={[
          'Cookies essenciais: necessários ao funcionamento básico da plataforma (autenticação e sessão). Não requerem consentimento prévio.',
          'Cookies de preferência: memorizam as opções do utilizador (ex.: modo claro/escuro). Requerem consentimento.',
          'Cookies analíticos: permitem a medição agregada e anónima da utilização, para fins de melhoria do serviço. Requerem consentimento.',
        ]}
      />

      <TermHeading>3. Gestão de Cookies</TermHeading>
      <TermParagraph>
        O utilizador pode, a qualquer momento, gerir ou eliminar os cookies
        através das configurações do seu navegador. A desativação de cookies
        essenciais pode, contudo, comprometer o funcionamento da plataforma.
      </TermParagraph>

      <TermHeading>4. Retirada do Consentimento</TermHeading>
      <TermParagraph>
        O consentimento para cookies não essenciais pode ser retirado a
        qualquer momento, com efeitos imediatos, através das preferências do
        navegador ou do mecanismo de gestão disponibilizado na plataforma.
      </TermParagraph>
    </div>
  );
}

function ContactContent() {
  return (
    <div>
      <TermHeading>Entidade Gestora</TermHeading>
      <TermParagraph>
        Poker Bankroll Dashboard é um serviço de registo e análise estatística
        de sessões de poker, de caráter pessoal e informativo, gerido por uma
        entidade de direito privado, não sujeita a licenciamento pelo Serviço
        de Regulação e Inspeção de Jogos (SRIJ), por não organizar nem
        facilitar jogos de azar.
      </TermParagraph>

      <TermHeading>Morada para Comunicações</TermHeading>
      <TermList
        items={[
          'Poker Bankroll Dashboard',
          'Lisboa, Portugal',
          'Email: contact@pokerbankroll.pt',
        ]}
      />

      <TermHeading>NIF e Registo</TermHeading>
      <TermParagraph>
        O NIF e demais elementos de identificação fiscal da entidade gestora
        podem ser solicitados por escrito através do endereço de email
        indicado acima.
      </TermParagraph>

      <TermHeading>Reclamações</TermHeading>
      <TermParagraph>
        As reclamações deverão ser apresentadas por escrito para o endereço de
        email acima. Na ausência de resposta satisfatória, o utilizador poderá
        recorrer aos mecanismos de resolução alternativa de litígios de consumo
        previstos na Lei n.º 144/2015, de 8 de setembro, designadamente ao
        Centro de Arbitragem de Conflitos de Consumo (CNIACC — www.cniacc.pt).
      </TermParagraph>

      <TermHeading>Autoridades de Supervisão</TermHeading>
      <TermList
        items={[
          'CNPD — Comissão Nacional de Proteção de Dados: www.cnpd.pt (proteção de dados pessoais).',
          'SRIJ — Serviço de Regulação e Inspeção de Jogos: www.srij.turismodeportugal.pt (jogos e apostas em Portugal).',
          'IGAC — Inspeção-Geral das Atividades Culturais: www.igac.gov.pt (direitos de autor).',
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
                {meta.subtitle} · Atualizado a {meta.lastUpdated}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar"
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
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
