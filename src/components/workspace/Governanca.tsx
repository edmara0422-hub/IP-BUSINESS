'use client'

import { useCallback } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, FileText, CheckSquare, BookOpen, Loader2, Copy, ChevronDown, Sparkles, Building } from 'lucide-react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'

const BLUE = '#1a5276'
const GREEN = '#1e8449'

// ── SASB Sectors (same as SASBFramework) ──

const SASB_SECTORS = [
  'Financeiro', 'Tecnologia', 'Saúde', 'Energia e Mineração', 'Bens de Consumo',
  'Agronegócio', 'Transporte e Logística', 'Construção', 'Educação e EdTech',
  'Serviços Profissionais', 'Alimentação e Bebidas',
]

const PORTES = ['MEI', 'Pequena', 'Média', 'Grande']

// ── Conteúdo do IPB (políticas completas) ──

const SECTIONS = [
  {
    id: 'politicas',
    title: 'Políticas',
    icon: FileText,
    items: [
      {
        title: 'Política de Privacidade e Dados (LGPD)',
        content: `OBJETIVO
Estabelecer diretrizes para coleta, tratamento e proteção de dados pessoais dos usuários da plataforma IPB, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).

ABRANGÊNCIA
Esta política aplica-se a todos os dados pessoais coletados através da plataforma IPB, incluindo dados de cadastro, dados de uso, dados financeiros inseridos no Workspace e dados de navegação.

DADOS COLETADOS
1. Dados de identificação: nome, email, senha (hash bcrypt)
2. Dados do workspace: receita, despesas, CAC, setor (inseridos voluntariamente pelo usuário)
3. Dados de navegação: páginas acessadas, tempo de uso, dispositivo
4. Dados de mercado consultados: indicadores, setores, relatórios gerados

BASE LEGAL
- Consentimento (Art. 7º, I): para dados pessoais no cadastro
- Execução de contrato (Art. 7º, V): para dados do workspace
- Legítimo interesse (Art. 7º, IX): para melhoria do serviço

ARMAZENAMENTO E SEGURANÇA
- Banco de dados: Supabase (PostgreSQL) com Row Level Security (RLS)
- Cada usuário acessa APENAS seus próprios dados
- Comunicação: 100% HTTPS/TLS
- Senhas: nunca armazenadas em texto — hash bcrypt
- Backups: automáticos diários
- Infraestrutura: Vercel (CDN) + Supabase (AWS)

DIREITOS DO TITULAR
1. Acesso: solicitar cópia de todos os seus dados
2. Correção: retificar dados incorretos
3. Exclusão: solicitar remoção total dos dados
4. Portabilidade: exportar dados em formato legível
5. Revogação: retirar consentimento a qualquer momento

COMPARTILHAMENTO
- Dados pessoais: NUNCA compartilhados com terceiros
- Benchmarks: sempre anônimos e agregados (mínimo 10 empresas por grupo)
- Dados de mercado: provenientes de fontes públicas (BCB, IBGE)

CANAL DO TITULAR
- Feedback no app (Workspace → Feedback & NPS)
- Email: privacidade@ipbusiness.app
- Prazo de resposta: 15 dias úteis conforme LGPD

VIGÊNCIA
Esta política entra em vigor na data de publicação e será revisada anualmente ou quando houver alteração legislativa relevante.`,
      },
      {
        title: 'Política de Diversidade e Inclusão',
        content: `OBJETIVO
Promover um ambiente digital inclusivo e acessível, garantindo que a plataforma IPB atenda a todos os perfis de usuários independentemente de gênero, raça, etnia, orientação sexual, deficiência, idade ou porte empresarial.

ABRANGÊNCIA
Aplica-se à equipe interna do IPB, à interface da plataforma, ao conteúdo gerado pela IA e a todas as comunicações institucionais.

DIRETRIZES DE ACESSIBILIDADE
1. Modo Foco (TDAH): bullets curtos, sem parágrafos longos, destaque visual em ações
2. Modo Calmo (TEA): linguagem literal, sem metáforas, sem animações excessivas
3. Modo Alto Contraste (visual): paleta ajustada para baixa visão e daltonismo
4. Interface legível para usuários 50+: tipografia clara, espaçamento adequado
5. Navegação por teclado: todos os elementos interativos acessíveis sem mouse

DIRETRIZES DE LINGUAGEM
1. Linguagem neutra — sem suposições de gênero em comunicações
2. Conteúdo em português claro — sem jargões desnecessários
3. IA adaptada por modo de acessibilidade (respostas personalizadas)

INCLUSÃO EMPRESARIAL
1. O app atende de MEI a LTDA — sem discriminação por porte
2. Plano gratuito para MEIs com módulos básicos de inteligência
3. Plano social para ONGs, associações e cooperativas
4. Linguagem ajustada ao nível de experiência do usuário

METAS INTERNAS
1. 50% de diversidade em cargos de liderança até 2027
2. Gap salarial auditado anualmente por consultoria independente
3. Inclusão de PcD além da cota legal (Art. 93, Lei 8.213/91)
4. Treinamento obrigatório de viés inconsciente para toda a equipe
5. Relatório de diversidade publicado anualmente

RESPONSABILIDADES
- CEO: patrocínio executivo e alocação de recursos
- RH: implementação dos programas e acompanhamento de metas
- Product: garantir acessibilidade em todas as features
- Todos os colaboradores: manter ambiente respeitoso

PENALIDADES
Condutas discriminatórias resultam em advertência formal, suspensão ou desligamento conforme gravidade. Casos podem ser reportados via Canal de Denúncias.

VIGÊNCIA
Revisão anual. Métricas de progresso publicadas no relatório de impacto.`,
      },
      {
        title: 'Política de Segurança da Informação',
        content: `OBJETIVO
Estabelecer diretrizes para proteção dos ativos de informação do IPB, garantindo confidencialidade, integridade e disponibilidade dos dados da plataforma e de seus usuários.

ABRANGÊNCIA
Aplica-se a toda a infraestrutura tecnológica do IPB, incluindo servidores, banco de dados, APIs, código-fonte, comunicações internas e dados de usuários.

CLASSIFICAÇÃO DE DADOS
1. Público: dados de mercado (SELIC, IPCA, PIB — fontes públicas)
2. Interno: código-fonte, documentação técnica, roadmap
3. Confidencial: dados pessoais de usuários, métricas individuais
4. Restrito: chaves de API, credenciais de banco, tokens de autenticação

INFRAESTRUTURA E CONTROLES
1. Hospedagem: Vercel (CDN global com edge computing)
2. Banco de dados: Supabase (PostgreSQL) com Row Level Security (RLS)
3. Autenticação: Supabase Auth com hash bcrypt e refresh tokens
4. Comunicação: 100% HTTPS/TLS — sem exceções
5. Chaves de API: armazenadas em variáveis de ambiente (nunca no código-fonte)
6. Backups: automáticos diários com retenção de 30 dias
7. Monitoramento: uptime monitoring com alertas em tempo real

CONTROLE DE ACESSO
1. Princípio do menor privilégio — cada serviço acessa apenas o necessário
2. RLS no banco: cada usuário acessa SOMENTE seus próprios dados
3. Tokens JWT com expiração configurada
4. Logs de acesso armazenados por 6 meses (Marco Civil da Internet)

RESPOSTA A INCIDENTES
1. Detecção: monitoramento automatizado de anomalias
2. Contenção: isolamento imediato do serviço afetado
3. Notificação: comunicação à ANPD em até 72 horas conforme LGPD
4. Notificação ao titular: quando o incidente gerar risco relevante
5. Recuperação: restauração via backup e correção da vulnerabilidade
6. Post-mortem: análise de causa raiz e atualização de controles

RESPONSABILIDADES
- CTO: gestão geral da segurança e resposta a incidentes
- Desenvolvedores: código seguro (OWASP Top 10), revisão de PRs
- Todos os colaboradores: não compartilhar credenciais, reportar anomalias

PENALIDADES
Violações de segurança por negligência resultam em advertência, suspensão ou desligamento. Vazamentos intencionais são passíveis de ação judicial.

VIGÊNCIA
Revisão semestral ou imediatamente após qualquer incidente de segurança.`,
      },
      {
        title: 'Política de Uso Aceitável',
        content: `OBJETIVO
Definir os limites de uso da plataforma IPB, protegendo a integridade do serviço, a segurança dos dados e os direitos de todos os usuários.

ABRANGÊNCIA
Aplica-se a todos os usuários da plataforma IPB, em todos os planos (gratuito e pagos), incluindo acesso via web, mobile e API.

DEFINIÇÕES
- Plataforma: o sistema IPB em todas as suas interfaces
- Usuário: qualquer pessoa física ou jurídica com conta ativa
- Dados de mercado: informações obtidas de fontes públicas (BCB, IBGE, Yahoo Finance, Brapi.dev)
- Workspace: área individual do usuário com dados financeiros

USO PERMITIDO
1. Consultar dados de mercado para tomada de decisão empresarial
2. Inserir dados próprios no workspace para análise e benchmarking
3. Gerar relatórios e documentos via IA para uso corporativo
4. Compartilhar insights gerados (com devida atribuição ao IPB)
5. Integrar dados exportados em apresentações e relatórios internos

USO PROIBIDO
1. Manipulação de mercado: usar dados para práticas de insider trading
2. Compartilhamento de credenciais: cada conta é individual e intransferível
3. Scraping ou crawling: extração automatizada de dados da plataforma
4. Engenharia reversa: decompilação do código ou dos algoritmos de IA
5. Uso comercial não autorizado: revender dados ou relatórios do IPB
6. Spam: uso do gerador de documentos para produzir conteúdo em massa
7. Fraude: inserir dados falsos para manipular benchmarks coletivos

ISENÇÃO DE RESPONSABILIDADE
- Os dados de mercado servem como REFERÊNCIA — não como recomendação financeira
- O IPB NÃO é assessoria de investimentos (CVM 598/18)
- Decisões tomadas com base nos dados são de responsabilidade do usuário
- A IA fornece análises e sugestões, não garantias de resultado

LIMITES DE USO
1. Chamadas à IA: limite por plano (gratuito: 10/dia, Pro: ilimitado)
2. Armazenamento: limite por plano (gratuito: dados básicos, Pro: completo)
3. Exportação: disponível em todos os planos

RESPONSABILIDADES
- Usuário: manter credenciais seguras, usar a plataforma de boa-fé
- IPB: manter disponibilidade, proteger dados, notificar mudanças

PENALIDADES
1. Primeira violação: notificação e advertência por email
2. Reincidência: suspensão temporária da conta (7 dias)
3. Violação grave: exclusão permanente da conta sem reembolso
4. Violações legais: encaminhamento às autoridades competentes

VIGÊNCIA
Esta política pode ser atualizada a qualquer momento, com notificação prévia de 15 dias aos usuários ativos.`,
      },
    ],
  },
  {
    id: 'praticas',
    title: 'Práticas',
    icon: CheckSquare,
    items: [
      {
        title: 'Transparência de Dados',
        content: `OBJETIVO
Garantir que todas as fontes de dados utilizadas pelo IPB sejam públicas, documentadas e verificáveis, mantendo a confiança do usuário na qualidade das informações.

ABRANGÊNCIA
Aplica-se a todos os dados de mercado exibidos na plataforma, incluindo indicadores macroeconômicos, cotações, benchmarks setoriais e dados de referência.

FONTES DE DADOS DOCUMENTADAS
1. SELIC: Banco Central do Brasil — série temporal 432
2. IPCA: Banco Central do Brasil — série temporal 13522
3. PIB: Banco Central — Relatório Focus (expectativas de mercado)
4. Câmbio USD/BRL: AwesomeAPI (dados de mercado em tempo real)
5. Ações brasileiras: Brapi.dev (cotações B3)
6. Commodities: AwesomeAPI (petróleo, ouro, soja, café)
7. Dados demográficos e setoriais: IBGE

PRINCÍPIOS DE TRANSPARÊNCIA
1. Toda fonte de dado exibida possui identificação visível na interface
2. Quando uma API falha, o sistema usa fallbacks documentados — nunca dados inventados
3. Dados de fallback são identificados com timestamp da última atualização real
4. O usuário pode verificar a fonte original a qualquer momento
5. Nenhum dado é alterado, interpolado ou estimado sem indicação explícita

BENCHMARKS E AGREGAÇÕES
1. Benchmarks setoriais são calculados a partir de dados agregados
2. Mínimo de 10 empresas por grupo para garantir anonimato
3. Outliers são tratados estatisticamente (exclusão de 5% extremos)
4. Metodologia de cálculo disponível na documentação

FREQUÊNCIA DE ATUALIZAÇÃO
1. Indicadores macroeconômicos: atualização diária (quando disponível na fonte)
2. Cotações de ações: atualização durante pregão (15 min delay Brapi)
3. Câmbio e commodities: atualização em tempo real (AwesomeAPI)
4. Benchmarks setoriais: recalculados semanalmente

RESPONSABILIDADES
- Backend: manter integrações, monitorar falhas, documentar fallbacks
- Product: garantir que fontes sejam visíveis na interface
- Compliance: auditar fontes anualmente

VIGÊNCIA
Revisão trimestral ou quando houver adição/remoção de fontes de dados.`,
      },
      {
        title: 'IA Responsável',
        content: `OBJETIVO
Definir princípios e práticas para o uso ético e transparente de inteligência artificial na plataforma IPB, garantindo que a IA sirva como ferramenta de apoio — nunca como decisor autônomo.

ABRANGÊNCIA
Aplica-se a todas as funcionalidades de IA do IPB: Advisor Chat, gerador de documentos, análises de benchmarking, relatórios automatizados e recomendações setoriais.

MODELO E INFRAESTRUTURA
1. Modelo: Groq/Llama 3.3 70B (open-source, auditável)
2. Sem fine-tuning com dados de usuários — modelo pré-treinado apenas
3. Chamadas via API com chave protegida (variável de ambiente)
4. Cache de 5 minutos para reduzir chamadas desnecessárias e custos

PRINCÍPIOS DE IA RESPONSÁVEL
1. Assistiva, não decisória: a IA apresenta dados e recomenda ações — o usuário decide
2. Transparência: prompts são documentados e auditáveis
3. Sem viés intencional: nenhuma recomendação favorece produto, setor ou empresa específica
4. Adaptabilidade: respostas ajustadas por modo de acessibilidade
   - TDAH: bullets curtos, ações diretas, sem parágrafos longos
   - TEA: linguagem literal, sem metáforas, estrutura previsível
   - Padrão: formato balanceado com contexto e recomendações

LIMITES DA IA
1. Nunca armazena conversas — cada sessão é independente e stateless
2. Não acessa dados pessoais do usuário sem solicitação explícita
3. Não faz recomendações de investimento (CVM 598/18)
4. Não gera conteúdo que viole direitos autorais ou legislação
5. Informa quando não tem dados suficientes para uma resposta confiável

MONITORAMENTO E AUDITORIA
1. Logs de uso agregados (sem conteúdo das conversas)
2. Métricas de satisfação via NPS e feedback no app
3. Revisão trimestral dos prompts e qualidade das respostas
4. Testes de viés em recomendações setoriais

RESPONSABILIDADES
- Product/AI: design dos prompts, monitoramento de qualidade
- Compliance: auditoria de viés e conformidade ética
- Usuário: usar a IA como ferramenta de apoio, não como conselho definitivo

VIGÊNCIA
Revisão semestral ou quando houver troca de modelo/provider de IA.`,
      },
      {
        title: 'Sustentabilidade Digital',
        content: `OBJETIVO
Minimizar o impacto ambiental da operação digital do IPB, adotando práticas de desenvolvimento sustentável e eficiência computacional.

ABRANGÊNCIA
Aplica-se à infraestrutura, código-fonte, processos de desenvolvimento e operações diárias da plataforma IPB.

PRINCÍPIOS
1. 100% digital — zero papel em todas as operações
2. Eficiência computacional como prioridade de engenharia
3. Redução ativa de consumo energético nos servidores
4. Transparência sobre pegada de carbono

PRÁTICAS DE EFICIÊNCIA
1. Hospedagem em edge (Vercel): reduz latência e consumo energético
2. Cache inteligente: 5 minutos para IA, dados de mercado com TTL configurável
3. Código otimizado: 7 APIs paralelas em vez de 23 sequenciais (redução de 70% em chamadas)
4. Lazy loading: componentes carregam sob demanda
5. Compressão de assets: imagens otimizadas, CSS/JS minificados
6. App leve: funciona em conexões lentas (3G) e dispositivos antigos

INFRAESTRUTURA VERDE
1. Vercel: CDN com data centers com certificação de eficiência energética
2. Supabase: infraestrutura AWS com compromisso de 100% energia renovável até 2025
3. Groq: chips LPU com eficiência energética superior a GPUs tradicionais
4. Sem servidores ociosos: serverless por padrão (escala a zero)

METAS AMBIENTAIS
1. Medir pegada de carbono dos servidores até Q4 2026
2. Compensar 100% das emissões digitais via créditos de carbono verificados
3. Reduzir chamadas à IA em 20% ao ano via cache e otimização de prompts
4. Publicar relatório de sustentabilidade digital anualmente

RESPONSABILIDADES
- Engineering: otimização de código e infraestrutura
- Product: decisões de design que priorizem eficiência
- Leadership: alocação de recursos para metas ambientais

VIGÊNCIA
Revisão anual com publicação de métricas de progresso.`,
      },
      {
        title: 'Investimento Social (ISP)',
        content: `OBJETIVO
Democratizar o acesso à inteligência de mercado e educação empresarial, reduzindo a desigualdade informacional que afeta micro e pequenas empresas no Brasil.

ABRANGÊNCIA
Aplica-se à estratégia de precificação, programas sociais, parcerias educacionais e destinação de receita do IPB.

CONTEXTO E JUSTIFICATIVA
O acesso a inteligência de mercado profissional custa entre R$50.000 e R$200.000 em consultorias tradicionais. O IPB democratiza esse conhecimento via IA, tornando-o acessível a qualquer porte de empresa.

PROGRAMAS DE ACESSO
1. Plano Gratuito para MEIs: módulos básicos de inteligência de mercado, dados macro e benchmarks públicos
2. Plano Social para ONGs e Associações: acesso completo com desconto de 80% mediante comprovação
3. Plano Educacional: acesso gratuito para instituições de ensino (uso em sala de aula)
4. Intelligence: currículo baseado no BI em Negócios da PUCPR acessível a todos os assinantes

DESTINAÇÃO DE RECEITA
1. Meta: 1-2% da receita bruta destinada a ISP
2. Áreas prioritárias: educação financeira, inclusão digital, empreendedorismo periférico
3. Parcerias com ONGs de referência (a definir com comitê de ISP)
4. Relatório de impacto social publicado anualmente

MÉTRICAS DE IMPACTO
1. Número de MEIs ativos no plano gratuito
2. Número de ONGs beneficiadas pelo plano social
3. Horas de conteúdo educacional consumidas
4. Taxa de retenção e crescimento dos negócios atendidos
5. NPS dos beneficiários dos programas sociais

RESPONSABILIDADES
- CEO: definição de metas de ISP e aprovação de parcerias
- Marketing: divulgação dos programas sociais
- Product: garantir que planos gratuitos/sociais tenham experiência digna
- Comitê de ISP: governança e acompanhamento das iniciativas

VIGÊNCIA
Revisão anual com base nas métricas de impacto e capacidade financeira da empresa.`,
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: Shield,
    items: [
      {
        title: 'LGPD (Lei Geral de Proteção de Dados)',
        content: `OBJETIVO
Garantir conformidade total com a Lei 13.709/2018, estabelecendo controles e processos para o tratamento adequado de dados pessoais na plataforma IPB.

ABRANGÊNCIA
Aplica-se a todo tratamento de dados pessoais realizado pelo IPB, desde a coleta até a eliminação, incluindo dados de usuários, colaboradores e parceiros.

BASE LEGAL PARA TRATAMENTO
1. Consentimento (Art. 7º, I): dados pessoais no cadastro — obtido de forma explícita e granular
2. Execução de contrato (Art. 7º, V): dados necessários para prestação do serviço (workspace)
3. Legítimo interesse (Art. 7º, IX): dados de uso para melhoria do serviço (analytics agregados)
4. Obrigação legal (Art. 7º, II): dados exigidos por lei (logs de acesso — Marco Civil)

ESTRUTURA DE PROTEÇÃO
1. Encarregado de Dados (DPO): designado conforme Art. 41 da LGPD
2. Registro de operações de tratamento (Art. 37): mantido e atualizado
3. Relatório de Impacto à Proteção de Dados (RIPD): elaborado para operações de risco
4. Privacy by Design: proteção incorporada desde a concepção de cada feature

DIREITOS DO TITULAR (Art. 18)
1. Confirmação da existência de tratamento
2. Acesso aos dados pessoais
3. Correção de dados incompletos ou desatualizados
4. Anonimização, bloqueio ou eliminação de dados desnecessários
5. Portabilidade dos dados a outro fornecedor
6. Eliminação dos dados tratados com base em consentimento
7. Informação sobre compartilhamento de dados
8. Revogação do consentimento

CANAL DE SOLICITAÇÃO DO TITULAR
- Feedback no app (Workspace → Feedback & NPS)
- Email: privacidade@ipbusiness.app
- Prazo de resposta: 15 dias úteis conforme Art. 18, §5º

INCIDENTES DE SEGURANÇA
- Comunicação à ANPD em prazo razoável conforme Art. 48
- Notificação ao titular quando houver risco ou dano relevante
- Registro detalhado do incidente e medidas adotadas

RESPONSABILIDADES
- DPO: orientação, monitoramento e ponto de contato com a ANPD
- Engineering: implementação técnica dos controles de privacidade
- Jurídico: acompanhamento legislativo e contratual
- Todos: treinamento anual em proteção de dados

PENALIDADES INTERNAS
Violações de privacidade por negligência: advertência, suspensão ou desligamento. Violações intencionais: ação judicial e comunicação à ANPD.

VIGÊNCIA
Revisão anual ou imediatamente quando houver alteração legislativa ou decisão da ANPD relevante.`,
      },
      {
        title: 'Marco Civil da Internet',
        content: `OBJETIVO
Garantir conformidade com a Lei 12.965/2014 (Marco Civil da Internet), respeitando os princípios de neutralidade, privacidade e liberdade de expressão na operação da plataforma IPB.

ABRANGÊNCIA
Aplica-se a todas as operações do IPB enquanto provedor de aplicação de internet, incluindo hospedagem de dados, logs de acesso e relação com usuários.

DIRETRIZES DE CONFORMIDADE
1. Neutralidade de rede: o IPB respeita integralmente o princípio de neutralidade — sem discriminação de conteúdo, origem ou destino
2. Guarda de registros de acesso: logs armazenados por 6 meses conforme Art. 15
3. Sigilo das comunicações: dados de navegação e uso são tratados com confidencialidade
4. Remoção de conteúdo: somente mediante ordem judicial específica (Art. 19)

REGISTROS DE ACESSO (Art. 15)
1. Dados registrados: IP, data/hora, ação realizada
2. Período de retenção: 6 meses (mínimo legal)
3. Acesso restrito: apenas mediante ordem judicial ou solicitação fundamentada da autoridade
4. Armazenamento seguro: criptografado e separado dos demais dados

TERMOS DE USO (Art. 7º, XI)
1. Termos de uso claros e acessíveis antes da contratação
2. Informação sobre coleta, uso e tratamento de dados
3. Opções de exclusão de dados conforme LGPD
4. Notificação prévia de alterações nos termos (15 dias)

RESPONSABILIDADES
1. O IPB não se responsabiliza por conteúdo gerado pela IA que o usuário decida utilizar de forma inadequada
2. O IPB coopera com autoridades judiciais quando devidamente requisitado
3. Dados de usuários brasileiros são armazenados em conformidade com a legislação nacional

PENALIDADES
O descumprimento do Marco Civil sujeita o IPB a sanções previstas no Art. 12: advertência, multa de até 10% do faturamento, suspensão temporária ou proibição de exercício das atividades.

VIGÊNCIA
Revisão anual ou quando houver alteração legislativa ou regulamentar relevante.`,
      },
      {
        title: 'Anticorrupção',
        content: `OBJETIVO
Garantir conformidade com a Lei Anticorrupção (Lei 12.846/2013) e estabelecer tolerância zero a práticas de corrupção, suborno ou vantagem indevida em todas as operações do IPB.

ABRANGÊNCIA
Aplica-se a todos os sócios, colaboradores, prestadores de serviço, parceiros comerciais e fornecedores que atuem em nome ou em benefício do IPB.

CONDUTAS PROIBIDAS
1. Oferecer, prometer ou conceder vantagem indevida a agente público
2. Financiar, patrocinar ou subsidiar práticas de corrupção
3. Fraudar licitações ou contratos públicos
4. Dificultar investigação ou fiscalização de órgãos públicos
5. Utilizar intermediários para ocultar interesses ilícitos
6. Oferecer presentes acima de R$100 a agentes públicos ou parceiros
7. Fazer doações políticas em nome da empresa sem aprovação do Conselho

DUE DILIGENCE DE PARCEIROS
1. Verificação de antecedentes de todos os parceiros comerciais
2. Consulta ao CEIS, CNEP e listas de sanções internacionais
3. Avaliação de risco anticorrupção antes de formalizar parcerias
4. Cláusula anticorrupção obrigatória em todos os contratos
5. Revisão periódica de parceiros de alto risco

CANAL DE DENÚNCIAS
1. Acesso anônimo no app (Workspace → Canal de Denúncias)
2. Garantia de não retaliação ao denunciante de boa-fé
3. Investigação conduzida por comitê independente
4. Prazo de apuração: 30 dias úteis
5. Feedback ao denunciante sobre o andamento (preservando o sigilo)

TREINAMENTO
1. Treinamento anual obrigatório para toda a equipe
2. Treinamento específico para áreas de risco (comercial, compras)
3. Registro de presença e avaliação de compreensão

RESPONSABILIDADES
- Compliance Officer: gestão do programa anticorrupção
- Jurídico: análise contratual e monitoramento legislativo
- Liderança: tom ético do topo (tone at the top)
- Todos: reportar situações suspeitas imediatamente

PENALIDADES
1. Colaboradores: advertência, suspensão ou desligamento por justa causa
2. Parceiros: rescisão contratual imediata
3. Empresa: as sanções da Lei 12.846 incluem multa de 0,1% a 20% do faturamento bruto

VIGÊNCIA
Revisão anual com atualização dos procedimentos de due diligence.`,
      },
      {
        title: 'Direitos do Consumidor (CDC)',
        content: `OBJETIVO
Garantir conformidade com o Código de Defesa do Consumidor (Lei 8.078/1990), assegurando relação transparente, justa e respeitosa com todos os usuários da plataforma IPB.

ABRANGÊNCIA
Aplica-se à relação comercial entre o IPB e todos os seus usuários, em todos os planos (gratuito e pagos), desde a pré-contratação até o pós-venda.

DIRETRIZES DE CONFORMIDADE
1. Informação clara e completa: preços, funcionalidades e limitações de cada plano apresentados antes da contratação (Art. 6º, III)
2. Publicidade: toda comunicação de marketing é verdadeira, sem práticas enganosas ou abusivas (Art. 37)
3. Proteção contratual: cláusulas redigidas de forma clara e acessível (Art. 46)
4. Vedação de cláusulas abusivas: sem multas desproporcionais, vinculação de serviços ou renúncia de direitos (Art. 51)

DIREITO DE ARREPENDIMENTO (Art. 49)
1. O usuário pode desistir da contratação em até 7 dias corridos
2. Reembolso integral, incluindo taxa de adesão (se houver)
3. Processo de cancelamento simples e acessível no próprio app
4. Confirmação de cancelamento enviada por email

CANCELAMENTO E RESCISÃO
1. Cancelamento de planos mensais: a qualquer momento, sem multa
2. Cancelamento de planos anuais: reembolso proporcional ao período não utilizado
3. Dados do usuário mantidos por 30 dias após cancelamento (para eventual reativação)
4. Após 30 dias: exclusão permanente conforme LGPD

ATENDIMENTO AO CONSUMIDOR
1. SAC disponível via chat no app e email
2. Prazo de resposta: 5 dias úteis para demandas simples
3. Prazo de resolução: 15 dias úteis para demandas complexas
4. Ouvidoria: canal de segunda instância para casos não resolvidos
5. Registro de todas as reclamações para melhoria contínua

RESPONSABILIDADES
- Product: garantir clareza nas informações de planos e funcionalidades
- Atendimento: resolver demandas dentro dos prazos legais
- Jurídico: revisão periódica de termos e conformidade com CDC
- Financeiro: processamento de reembolsos dentro do prazo

PENALIDADES
O descumprimento do CDC sujeita o IPB às sanções previstas no Art. 56: multa, apreensão do produto, suspensão da atividade, entre outras.

VIGÊNCIA
Revisão anual ou quando houver alteração nos planos, preços ou funcionalidades oferecidas.`,
      },
    ],
  },
  {
    id: 'codigos',
    title: 'Códigos',
    icon: BookOpen,
    items: [
      {
        title: 'Código de Ética',
        content: `OBJETIVO
Estabelecer os princípios éticos que orientam todas as ações do IPB, seus colaboradores, parceiros e fornecedores, promovendo integridade e confiança em todas as relações.

ABRANGÊNCIA
Aplica-se a todos os sócios, colaboradores (CLT e PJ), estagiários, parceiros comerciais e fornecedores que atuem em nome do IPB.

VALORES E PRINCÍPIOS
1. Integridade: agir com honestidade e coerência entre discurso e prática
2. Transparência: comunicar de forma clara e verdadeira, interna e externamente
3. Respeito: tratar todas as pessoas com dignidade, independentemente de cargo ou origem
4. Inovação responsável: desenvolver tecnologia que beneficie a sociedade
5. Excelência: buscar qualidade em tudo que fazemos, sem comprometer a ética

CONDUTAS PROIBIDAS
1. Discriminação de qualquer natureza (raça, gênero, orientação sexual, religião, deficiência, idade, origem)
2. Assédio moral: humilhação, intimidação, isolamento ou perseguição sistemática
3. Assédio sexual: qualquer conduta de natureza sexual não consentida
4. Conflito de interesses não declarado: atividades pessoais que conflitem com os interesses do IPB
5. Uso de informação privilegiada: utilizar dados internos para benefício pessoal
6. Falsificação de dados, documentos ou relatórios
7. Retaliação contra denunciantes de boa-fé

RELAÇÕES COM STAKEHOLDERS
1. Clientes/usuários: entregar valor real, sem promessas enganosas
2. Fornecedores: relação justa, seleção por mérito e conformidade ESG
3. Governo: cumprimento integral da legislação, sem favorecimentos
4. Concorrentes: competição leal, sem práticas anticoncorrenciais
5. Sociedade: contribuir positivamente via ISP e democratização do acesso

CANAL DE DENÚNCIAS
1. Acesso anônimo no app (Workspace → Canal de Denúncias)
2. Garantia de sigilo absoluto e não retaliação
3. Apuração independente em até 30 dias úteis
4. Feedback ao denunciante preservando o sigilo

RESPONSABILIDADES
- Liderança: exemplificar os valores e promover cultura ética
- RH: integrar o código no onboarding e treinamentos
- Compliance: monitorar conformidade e investigar denúncias
- Todos: conhecer, praticar e reportar violações

PENALIDADES
1. Advertência verbal ou escrita
2. Suspensão temporária
3. Desligamento por justa causa
4. Medidas judiciais cabíveis
A gravidade da sanção é proporcional à infração e avaliada pelo comitê de ética.

VIGÊNCIA
Todos os colaboradores assinam o código no onboarding. Revisão anual com participação do comitê de ética.`,
      },
      {
        title: 'Código de Conduta Digital',
        content: `OBJETIVO
Estabelecer regras de conduta para o uso responsável da plataforma IPB e de suas ferramentas de inteligência artificial, protegendo a integridade do ecossistema digital.

ABRANGÊNCIA
Aplica-se a todos os usuários da plataforma IPB, colaboradores internos e qualquer pessoa que interaja com as ferramentas digitais do IPB.

DIRETRIZES DE USO DA IA
1. Uso responsável: a IA é ferramenta de apoio — validar informações antes de tomar decisões
2. Proibido gerar conteúdo enganoso, difamatório ou ilegal via IA do IPB
3. Proibido usar o gerador de documentos para produção em massa de conteúdo spam
4. Proibido automatizar interações com a IA para fins de scraping ou abuso
5. Respeitar os limites de uso estabelecidos por plano

PROPRIEDADE INTELECTUAL
1. O conteúdo gerado pela IA do IPB pode ser utilizado livremente pelo usuário
2. O código-fonte, algoritmos e design do IPB são propriedade intelectual protegida
3. Proibida a reprodução, distribuição ou comercialização da plataforma ou de suas partes
4. Dados de mercado de fontes públicas mantêm suas licenças originais

SEGURANÇA DIGITAL
1. Não compartilhar dados de login com terceiros
2. Não tentar acessar dados de outros usuários
3. Não tentar explorar vulnerabilidades da plataforma
4. Reportar vulnerabilidades de segurança descobertas (programa de bug bounty futuro)
5. Utilizar senhas fortes e únicas para a conta IPB

CONDUTA EM CANAIS DIGITAIS
1. Respeito nas interações com suporte e comunidade
2. Não compartilhar conteúdo ofensivo, discriminatório ou ilegal
3. Não usar a plataforma para atividades que violem leis brasileiras
4. Respeitar os direitos de propriedade intelectual de terceiros

RESPONSABILIDADES
- Usuário: usar a plataforma de forma ética e legal
- IPB: fornecer ferramentas seguras e manter transparência sobre uso dos dados
- Moderação: monitorar e agir sobre denúncias de violação

PENALIDADES
1. Notificação de conduta inadequada
2. Restrição de funcionalidades (ex: limite de IA reduzido)
3. Suspensão temporária da conta
4. Exclusão permanente em casos graves
5. Encaminhamento às autoridades para condutas criminosas

VIGÊNCIA
Revisão semestral. Alterações comunicadas com 15 dias de antecedência.`,
      },
      {
        title: 'Código de Fornecedores',
        content: `OBJETIVO
Estabelecer padrões mínimos de conduta para todos os fornecedores de tecnologia, dados e serviços do IPB, garantindo alinhamento com nossos valores ESG e compromisso ético.

ABRANGÊNCIA
Aplica-se a todos os fornecedores de infraestrutura, dados, serviços e ferramentas utilizados pelo IPB, incluindo Vercel, Supabase, Groq, BCB, IBGE, Brapi.dev, AwesomeAPI e futuros parceiros.

FORNECEDORES ATUAIS E CRITÉRIOS
1. Vercel (hospedagem): avaliado por segurança, uptime (99.99%), compliance SOC 2, eficiência energética
2. Supabase (banco de dados): avaliado por RLS, criptografia, compliance SOC 2, open-source
3. Groq (IA): avaliado por privacidade (sem retenção de dados), eficiência energética (LPU), performance
4. BCB/IBGE (dados públicos): fontes governamentais, auditáveis, sem custo
5. Brapi.dev (ações): avaliado por confiabilidade, cobertura B3, termos de uso
6. AwesomeAPI (câmbio/commodities): avaliado por uptime, precisão, gratuidade

CRITÉRIOS ESG PARA SELEÇÃO
1. Ambiental: compromisso documentado com redução de emissões e energia renovável
2. Social: práticas trabalhistas justas, diversidade e inclusão
3. Governança: compliance com legislação local, políticas anticorrupção, transparência
4. Preferência por fornecedores open-source e auditáveis

DIRETRIZES OBRIGATÓRIAS
1. Proibição de trabalho infantil ou forçado em qualquer nível da cadeia
2. Conformidade com LGPD e legislação de privacidade aplicável
3. Cláusula anticorrupção em todos os contratos
4. Notificação imediata de incidentes de segurança que afetem dados do IPB
5. Disponibilidade para auditoria quando solicitado

MONITORAMENTO E AVALIAÇÃO
1. Avaliação anual de desempenho e conformidade de cada fornecedor
2. Monitoramento contínuo de uptime e qualidade dos serviços
3. Revisão de termos de uso e políticas de privacidade a cada renovação
4. Plano de contingência e fornecedores alternativos para serviços críticos

RESPONSABILIDADES
- CTO: seleção técnica e monitoramento de fornecedores de infraestrutura
- Compliance: avaliação ESG e contratual
- Jurídico: revisão de contratos e cláusulas de conformidade
- Product: avaliação de qualidade de dados e APIs

PENALIDADES
1. Não conformidade leve: notificação e prazo para correção (30 dias)
2. Não conformidade grave: suspensão imediata e migração para alternativa
3. Violação de LGPD ou anticorrupção: rescisão contratual imediata

VIGÊNCIA
Revisão anual. Novos fornecedores passam por avaliação completa antes da contratação.`,
      },
    ],
  },
]

// ── Templates para empresas gerarem seus documentos ──

const GENERATOR_TEMPLATES = [
  {
    id: 'privacidade',
    label: 'Política de Privacidade (LGPD)',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere uma Política de Privacidade completa seguindo a LGPD (Lei 13.709/2018) para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): dados coletados, base legal, compartilhamento, cookies, segurança\n5. RESPONSABILIDADES (DPO, TI, jurídico)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}. Seja profissional e completo.`,
  },
  {
    id: 'diversidade',
    label: 'Política de Diversidade e Inclusão',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere uma Política de Diversidade e Inclusão corporativa para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): metas mensuráveis por gênero, raça, PcD, LGBTQIA+, análise de gap salarial, acessibilidade\n5. RESPONSABILIDADES (RH, liderança, comitê)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}. Inclua cronograma de implementação de 6 meses.`,
  },
  {
    id: 'etica',
    label: 'Código de Ética',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere um Código de Ética corporativo para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): valores, condutas proibidas (assédio, discriminação, conflito de interesses), relação com clientes, fornecedores e governo\n5. RESPONSABILIDADES (comitê de ética, liderança, colaboradores)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}.`,
  },
  {
    id: 'seguranca',
    label: 'Política de Segurança da Informação',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere uma Política de Segurança da Informação para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): classificação de dados, controle de acesso, senhas, backup, resposta a incidentes, LGPD, BYOD, cloud\n5. RESPONSABILIDADES (TI, CISO, colaboradores)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}.`,
  },
  {
    id: 'compliance',
    label: 'Programa de Compliance',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere um Programa de Compliance corporativo para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): estrutura (comitê, responsáveis), canal de denúncias, due diligence, anticorrupção (Lei 12.846), treinamento, KPIs\n5. RESPONSABILIDADES (compliance officer, diretoria, auditoria)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}. Inclua plano de implementação de 90 dias.`,
  },
  {
    id: 'conduta',
    label: 'Código de Conduta',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere um Código de Conduta empresarial para a empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): comportamento, uso de recursos, redes sociais, confidencialidade, presentes, concorrentes, meio ambiente\n5. RESPONSABILIDADES (gestores, RH, colaboradores)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}.`,
  },
  {
    id: 'fornecedores',
    label: 'Código de Fornecedores',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere um Código de Conduta para Fornecedores da empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): critérios ESG, trabalho justo, meio ambiente, anticorrupção, proteção de dados, auditoria\n5. RESPONSABILIDADES (compras, compliance, fornecedor)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES\nPersonalize para empresa do setor ${setor}, porte ${porte}.`,
  },
  {
    id: 'termos',
    label: 'Termos de Uso (SaaS)',
    prompt: (empresa: string, setor: string, porte: string) =>
      `Gere Termos de Uso para uma plataforma SaaS da empresa "${empresa}", do setor ${setor}, porte ${porte}. Gere o documento com estas seções:\n1. OBJETIVO\n2. ABRANGÊNCIA\n3. DEFINIÇÕES\n4. DIRETRIZES (numeradas): aceitação, conta do usuário, planos e pagamento, uso aceitável, propriedade intelectual, limitação de responsabilidade, cancelamento\n5. RESPONSABILIDADES (empresa, usuário)\n6. VIGÊNCIA E REVISÃO\n7. PENALIDADES E FORO\nPersonalize para empresa do setor ${setor}, porte ${porte}.`,
  },
]

const GOV_DEFAULT = {
  empresa: '',
  setor: '',
  porte: '',
  funcionarios: '',
  faturamento: '',
  tipoProduto: '',
  temInvestidores: '',
  exporta: '',
  temESG: '',
  generated: {} as Record<string, string>,
}

export default function Governanca() {
  const [openSection, setOpenSection] = useState<string | null>('politicas')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const { data: gov, update: updateGov } = useWorkspaceData('governanca', GOV_DEFAULT)

  const empresa = gov.empresa; const setEmpresa = (v: string) => updateGov({ empresa: v })
  const setor = gov.setor; const setSetor = (v: string) => updateGov({ setor: v })
  const porte = gov.porte; const setPorte = (v: string) => updateGov({ porte: v })
  const funcionarios = gov.funcionarios; const setFuncionarios = (v: string) => updateGov({ funcionarios: v })
  const faturamento = gov.faturamento; const setFaturamento = (v: string) => updateGov({ faturamento: v })
  const tipoProduto = gov.tipoProduto; const setTipoProduto = (v: string) => updateGov({ tipoProduto: v })
  const temInvestidores = gov.temInvestidores; const setTemInvestidores = (v: string) => updateGov({ temInvestidores: v })
  const exporta = gov.exporta; const setExporta = (v: string) => updateGov({ exporta: v })
  const temESG = gov.temESG; const setTemESG = (v: string) => updateGov({ temESG: v })
  const generated = gov.generated
  const setGenerated = (updater: (prev: Record<string, string>) => Record<string, string>) => {
    updateGov({ generated: updater(gov.generated) })
  }

  const contextReady = empresa.trim().length > 0 && setor.length > 0 && porte.length > 0

  const generate = useCallback(async (id: string, promptFn: (e: string, s: string, p: string) => string) => {
    if (!contextReady) return
    setGenerating(id)
    try {
      const prompt = promptFn(empresa.trim(), setor, porte)
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          marketContext: `Documento corporativo para empresa brasileira "${empresa.trim()}", setor ${setor}, porte ${porte}. ${funcionarios ? 'Funcionários: ' + funcionarios + '.' : ''} ${faturamento ? 'Faturamento: ' + faturamento + '.' : ''} ${tipoProduto ? 'Produto: ' + tipoProduto + '.' : ''} ${temInvestidores ? 'Investidores: ' + temInvestidores + '.' : ''} ${exporta ? 'Exporta: ' + exporta + '.' : ''} ${temESG ? 'Já tem ESG: ' + temESG + '.' : ''}`,
        }),
      })
      const data = await res.json()
      setGenerated(prev => ({ ...prev, [id]: data.answer ?? 'Erro ao gerar.' }))
    } catch {
      setGenerated(prev => ({ ...prev, [id]: 'Erro ao conectar com IA.' }))
    } finally {
      setGenerating(null)
    }
  }, [contextReady, empresa, setor, porte])

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} color={BLUE} />
          <p className="text-[15px] font-bold text-white/80">Governanca IPB</p>
        </div>
        <p className="text-[12px] text-white/35">Politicas, praticas, compliance e codigos do IPB. Abaixo: gerador para sua empresa.</p>
      </div>

      {/* 4 Secoes do IPB */}
      <div className="flex flex-col gap-2 mb-8">
        {SECTIONS.map(section => {
          const Icon = section.icon
          const isOpen = openSection === section.id
          return (
            <div key={section.id} className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `3px solid ${BLUE}` }}>
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <Icon size={16} style={{ color: BLUE }} />
                <span className="text-[14px] font-semibold text-white/70 flex-1">{section.title}</span>
                <span className="text-[11px] text-white/25">{section.items.length} docs</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} className="text-white/25" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 flex flex-col gap-1.5">
                      {section.items.map(item => {
                        const itemOpen = openItem === item.title
                        return (
                          <div key={item.title}>
                            <button
                              onClick={() => setOpenItem(itemOpen ? null : item.title)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all"
                              style={{ background: itemOpen ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                            >
                              <FileText size={12} className="text-white/20 shrink-0" />
                              <span className="text-[13px] text-white/55 flex-1">{item.title}</span>
                              <motion.div animate={{ rotate: itemOpen ? 180 : 0 }}>
                                <ChevronDown size={12} className="text-white/15" />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {itemOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="px-3 py-3 ml-5 rounded-md" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                                    <p className="text-[12px] text-white/45 leading-relaxed whitespace-pre-line">{item.content}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-6" />

      {/* Gerador para empresas */}
      <div>
        <button
          onClick={() => setGeneratorOpen(!generatorOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
          style={{ background: 'rgba(30,132,73,0.08)', border: '1px solid rgba(30,132,73,0.15)' }}
        >
          <Sparkles size={16} color={GREEN} />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white/70">Gerador de Documentos para Empresas</p>
            <p className="text-[11px] text-white/30">IA gera politicas, codigos e compliance personalizados para sua empresa</p>
          </div>
          <motion.div animate={{ rotate: generatorOpen ? 180 : 0 }}>
            <ChevronDown size={16} className="text-white/25" />
          </motion.div>
        </button>

        <AnimatePresence>
          {generatorOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="flex flex-col gap-4 mt-3">

                {/* Company Context Inputs */}
                <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Building size={14} color={GREEN} />
                    <span className="text-[13px] font-semibold text-white/60">Contexto da Empresa</span>
                  </div>

                  {/* Nome */}
                  <div className="mb-3">
                    <label className="text-[11px] text-white/30 mb-1 block">Nome da empresa</label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={e => setEmpresa(e.target.value)}
                      placeholder="Ex: Minha Empresa LTDA"
                      className="w-full px-3 py-2 rounded-md text-[13px] text-white/70 placeholder-white/20 outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>

                  {/* Setor */}
                  <div className="mb-3">
                    <label className="text-[11px] text-white/30 mb-1.5 block">Setor (SASB)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {SASB_SECTORS.map(s => (
                        <button
                          key={s}
                          onClick={() => setSetor(setor === s ? '' : s)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                          style={{
                            background: setor === s ? `${GREEN}22` : 'rgba(0,0,0,0.3)',
                            border: `1px solid ${setor === s ? GREEN : 'rgba(255,255,255,0.08)'}`,
                            color: setor === s ? GREEN : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Porte */}
                  <div>
                    <label className="text-[11px] text-white/30 mb-1.5 block">Porte</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PORTES.map(p => (
                        <button
                          key={p}
                          onClick={() => setPorte(porte === p ? '' : p)}
                          className="text-[11px] px-3 py-1 rounded-full transition-all"
                          style={{
                            background: porte === p ? `${GREEN}22` : 'rgba(0,0,0,0.3)',
                            border: `1px solid ${porte === p ? GREEN : 'rgba(255,255,255,0.08)'}`,
                            color: porte === p ? GREEN : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Funcionários */}
                  <div className="mt-3">
                    <label className="text-[11px] text-white/30 mb-1 block">Número de funcionários</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['1-5', '6-20', '21-50', '51-200', '200+'].map(f => (
                        <button key={f} onClick={() => setFuncionarios(funcionarios === f ? '' : f)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                          style={{ background: funcionarios === f ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${funcionarios === f ? GREEN : 'rgba(255,255,255,0.08)'}`, color: funcionarios === f ? GREEN : 'rgba(255,255,255,0.4)' }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Faturamento */}
                  <div className="mt-3">
                    <label className="text-[11px] text-white/30 mb-1 block">Faturamento anual</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Até R$81k', 'R$81k-360k', 'R$360k-4.8M', 'Acima R$4.8M'].map(f => (
                        <button key={f} onClick={() => setFaturamento(faturamento === f ? '' : f)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                          style={{ background: faturamento === f ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${faturamento === f ? GREEN : 'rgba(255,255,255,0.08)'}`, color: faturamento === f ? GREEN : 'rgba(255,255,255,0.4)' }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de produto */}
                  <div className="mt-3">
                    <label className="text-[11px] text-white/30 mb-1 block">Tipo de produto/serviço</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Digital/SaaS', 'Físico', 'Serviço', 'Marketplace', 'E-commerce', 'Consultoria'].map(t => (
                        <button key={t} onClick={() => setTipoProduto(tipoProduto === t ? '' : t)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                          style={{ background: tipoProduto === t ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${tipoProduto === t ? GREEN : 'rgba(255,255,255,0.08)'}`, color: tipoProduto === t ? GREEN : 'rgba(255,255,255,0.4)' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Investidores + Exporta + ESG */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-white/30 mb-1 block">Tem investidores?</label>
                      <div className="flex gap-1.5">
                        {['Sim', 'Não'].map(v => (
                          <button key={v} onClick={() => setTemInvestidores(temInvestidores === v ? '' : v)}
                            className="text-[11px] px-3 py-1 rounded-full flex-1 transition-all"
                            style={{ background: temInvestidores === v ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${temInvestidores === v ? GREEN : 'rgba(255,255,255,0.08)'}`, color: temInvestidores === v ? GREEN : 'rgba(255,255,255,0.4)' }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/30 mb-1 block">Exporta?</label>
                      <div className="flex gap-1.5">
                        {['Sim', 'Não'].map(v => (
                          <button key={v} onClick={() => setExporta(exporta === v ? '' : v)}
                            className="text-[11px] px-3 py-1 rounded-full flex-1 transition-all"
                            style={{ background: exporta === v ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${exporta === v ? GREEN : 'rgba(255,255,255,0.08)'}`, color: exporta === v ? GREEN : 'rgba(255,255,255,0.4)' }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/30 mb-1 block">Já tem política ESG?</label>
                      <div className="flex gap-1.5">
                        {['Sim', 'Não'].map(v => (
                          <button key={v} onClick={() => setTemESG(temESG === v ? '' : v)}
                            className="text-[11px] px-3 py-1 rounded-full flex-1 transition-all"
                            style={{ background: temESG === v ? `${GREEN}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${temESG === v ? GREEN : 'rgba(255,255,255,0.08)'}`, color: temESG === v ? GREEN : 'rgba(255,255,255,0.4)' }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!contextReady && (
                    <p className="text-[11px] text-white/20 mt-3 italic">Preencha nome, setor e porte para habilitar a geração.</p>
                  )}
                </div>

                {/* Templates */}
                {GENERATOR_TEMPLATES.map(tpl => (
                  <div key={tpl.id} className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-white/60">{tpl.label}</span>
                        <button
                          onClick={() => generate(tpl.id, tpl.prompt)}
                          disabled={generating === tpl.id || !contextReady}
                          className="text-[11px] font-bold px-3 py-1 rounded-md transition-all"
                          style={{
                            background: contextReady ? `${GREEN}18` : 'rgba(255,255,255,0.03)',
                            color: contextReady ? GREEN : 'rgba(255,255,255,0.15)',
                            border: `1px solid ${contextReady ? GREEN + '30' : 'rgba(255,255,255,0.05)'}`,
                            cursor: contextReady ? 'pointer' : 'not-allowed',
                          }}
                        >
                          {generating === tpl.id ? (
                            <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Gerando...</span>
                          ) : generated[tpl.id] ? 'Regerar' : 'Gerar com IA'}
                        </button>
                      </div>

                      {generated[tpl.id] && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="rounded-md p-3 mt-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-[12px] text-white/50 leading-relaxed whitespace-pre-line">{generated[tpl.id]}</p>
                          </div>
                          <button
                            onClick={() => copyText(tpl.id, generated[tpl.id])}
                            className="mt-2 text-[11px] flex items-center gap-1 px-3 py-1 rounded-md transition-all"
                            style={{ border: `1px solid ${copied === tpl.id ? GREEN : 'rgba(255,255,255,0.1)'}`, color: copied === tpl.id ? GREEN : 'rgba(255,255,255,0.35)' }}
                          >
                            <Copy size={12} /> {copied === tpl.id ? 'Copiado!' : 'Copiar documento'}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
