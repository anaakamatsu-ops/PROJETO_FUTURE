# Preparação para implantação

Esta entrega é uma demonstração local, não uma declaração de conformidade. Não há integração com sistemas corporativos nem WhatsApp. O link poderá ser compartilhado manualmente depois de uma implantação autorizada.

## Ambiente

1. Definir provedor Node.js 24+, domínio HTTPS e volume persistente privado para SQLite. Para múltiplas instâncias, escolher PostgreSQL e implementar a migração.
2. Gerar o build: `npm run build`.
3. Copiar `.env.example` para `.env` e definir `NODE_ENV=production`, `APP_ORIGIN`, `PORT`, `HOST`, banco e SMTP. Nunca versionar credenciais.
4. Iniciar com `node --env-file=.env server/index.ts`, atrás de proxy reverso HTTPS. O programa recusa iniciar em produção sem HTTPS na origem e SMTP completo. `scripts/preview.mjs` é exclusivamente local e força modo de demonstração.
5. Configurar SMTP com TLS, remetente autorizado, SPF/DKIM/DMARC e limites de envio. O envio só acontece em produção. Testar entrega, expiração e retorno do link no aparelho usado para receber o e-mail.
6. Definir backups cifrados, acesso de manutenção restrito, procedimento de restauração e prazo de descarte. Limites do MVP ficam no banco; planejar limitação no proxy para abuso de conexão e proteção volumétrica.
7. Agendar limpeza de tokens, sessões e contadores expirados: o MVP limpa no próximo pedido de autenticação, mas a produção deve ter rotina periódica. Estabelecer descarte de contas inativas com comunicação adequada.
8. Validar instalação Android/Chrome, iPhone/Safari e desktop, reabertura offline, retomada de áudio, foco, contraste e leitor de tela. O navegador interno do WhatsApp pode limitar a instalação; orientar abrir no navegador padrão.
9. Fazer teste piloto voluntário e revisão do conteúdo por profissional habilitado antes de oferecê-lo amplamente. Revisar as políticas depois de definir a entidade responsável pelo produto.

## Mapa inicial de tratamento

| Dado/operação | Finalidade | Onde fica no MVP | Retenção proposta do MVP |
|---|---|---|---|
| E-mail e nome opcional | Conta e saudação | SQLite local | Até exclusão pelo titular; política de inatividade pendente |
| Hash do link de acesso | Autenticação | SQLite | Uso único ou expiração de 15 min; limpeza no próximo pedido |
| Hash da sessão e identificador da conta | Manter acesso | SQLite e cookie HttpOnly | 7 dias, logout ou exclusão |
| Hash de identificador de limite (e-mail/IP) e contador | Reduzir abuso | SQLite | Janela de 15 min; limpeza no próximo pedido |
| Data/título de prática, se ativado | Histórico pessoal | localStorage por conta | Até 30 entradas; apagar ao desativar ou excluir neste dispositivo |
| Resposta de encerramento | Reflexão pontual | Memória da tela | Não persistida nem enviada |
| Cache de áudios públicos | Ouvir offline | Cache Storage | Até remoção pelo usuário/navegador |

Base legal deve ser definida por finalidade e contexto antes do piloto corporativo. O MVP não transforma uma caixa de aceite em autorização geral nem presume consentimento como fundamento automático em uma relação empregatícia. A participação voluntária e a disponibilidade da prática não permitem reutilizar dados para gestão de desempenho.

Não há painel de gestores, ranking, telemetria publicitária ou transmissão de avaliações emocionais. Administradores da infraestrutura que possuam acesso direto ao banco tecnicamente podem acessar dados da conta; isso exige controle de acesso e deveres definidos. Não prometer anonimato ou sigilo clínico.

## Decisões necessárias antes de disponibilizar a funcionários

- Identificar controlador, operadores, contato de privacidade e responsabilidades entre empresa contratante e fornecedora do app.
- Documentar finalidades, bases legais, retenção, fornecedores SMTP/hospedagem, localização dos dados e eventuais transferências internacionais.
- Publicar aviso de privacidade específico com direitos e canal de atendimento; validar procedimento de acesso, correção, eliminação e incidentes.
- Não ativar um painel empresarial sem análise de reidentificação, supressão de grupos pequenos e revisão independente da finalidade.
- Revisar acesso em aparelhos compartilhados: o histórico é local e opcional; desativar antes de sair apaga este histórico. Outros dispositivos precisam ser limpos separadamente.

Fonte oficial para princípios, transparência, direitos e segurança: [Lei nº 13.709/2018, texto compilado, especialmente arts. 6º, 7º, 9º, 18 e 46](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm), consultada em 24/10/2026. As medidas acima são decisões de projeto e preparação; a base legal concreta e os contratos ainda dependem do arranjo real da implantação.
