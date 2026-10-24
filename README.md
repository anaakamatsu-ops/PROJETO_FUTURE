# Aqui e Agora — Um momento para você

MVP local funcional de bem-estar, em português brasileiro. React + TypeScript, Vite, Motion, SVG, Lottie e API Node.js + TypeScript com SQLite. Nenhuma publicação ou comunicação a funcionários foi realizada.

## Abrir a demonstração

A versão construída está em `dist/`. No computador de Ana Claudia, abra `Abrir-app.cmd` ou use:

```sh
npm install
npm run build
npm run preview
```

Acesse **http://127.0.0.1:4173**. Requer Node.js 24 ou superior. Se a prévia já estiver em execução, basta abrir o endereço. O arquivo de inicialização usa a instalação Node do Codex quando disponível. A pasta precisa continuar no computador durante o uso.

O acesso da demonstração solicita um e-mail e permite testar um link real, de uso único, pelo botão **Continuar na demonstração**. Não envia e-mails e não comprova a posse de uma caixa postal. Este modo só escuta em loopback e não deve ser exposto a uma rede.

## 1. Conceito e proposta de valor

Uma pausa voluntária entre tarefas, sem metas, sequências obrigatórias, pontuação ou cobrança. A pessoa escolhe meditar com a respiração ou observar o ambiente. Uma voz acompanha a prática, com liberdade para interromper.

“Você não precisa estar em outro lugar nem ser outra pessoa. Por alguns instantes, permita-se estar aqui e agora.”

## 2. Telas e jornada

Convite → e-mail e nome opcional → boas-vindas com áudio e legenda → espaço pessoal → meditação → encerramento e resposta opcional, descartada ao sair.

As áreas Práticas, Pesquisas e Seu cuidado são acessíveis pela navegação. O cadastro cria a conta somente após validar o link. O histórico fica desligado por padrão; se ativado, guarda até 30 práticas apenas no navegador. Não registra emoções. Não há painel empresarial.

## 3. Identidade visual

Verde-floresta `#234D3E`, sálvia `#DDE4D6`, off-white `#F7F6EF`, areia e luz dourada suave. Títulos em Georgia e leitura em Segoe UI/Arial, sem dependência de fontes externas. Marca botânica em SVG, paisagem original gerada para o projeto e otimizada em WebP, cartões de práticas e controles de toque.

Motion faz transições discretas; o jardim usa SVG animado; o encerramento usa uma animação Lottie original carregada sob demanda. O círculo usa luz, volume e sombra para sugerir profundidade sem exigir WebGL. `prefers-reduced-motion` oferece alternativas estáticas. A animação não determina o ritmo respiratório.

## 4. Storyboard audiovisual

| Momento | Imagem e ação | Áudio |
|---|---|---|
| Convite | Jardim com lago ao amanhecer | Silêncio; reprodução depende de toque |
| Boas-vindas | Paisagem estática e legenda de cada trecho | Apresentação de 2min40s, com pausa e repetição |
| Preparação | Pessoa sentada confortavelmente no jardim vetorial | Corpo, apoios, olhos abertos ou fechados |
| Atenção | Jardim ou círculo de presença | Respiração natural, sem retenção |
| Contagem | Estado visual acompanha os números 1–10 | A voz conduz todos os números automaticamente |
| Retorno | Jardim e legenda do encerramento | Corpo, sons, abrir os olhos lentamente |
| Finalização | Folha em Lottie ou SVG estático | Música interrompida; resposta opcional |

O vídeo real não foi produzido. A cena vetorial original é a alternativa implementada e identificada na interface.

## 5. Roteiro com pausas e tempos reais

Consulte [o roteiro completo e a linha do tempo](docs/05-roteiro-e-timeline.md). A primeira meditação dura **11 minutos**, medidos nos arquivos de áudio. Boas-vindas Gemini: aproximadamente 2min05s. Atenção ao ambiente: aproximadamente 2min34s.

A voz conduz a contagem de um a dez sem exigir toques para avançar. Depois do dez, acompanha o retorno ao ambiente e convida a abrir os olhos lentamente. Pausas são convites; a pessoa pode pausar a gravação se precisar de mais tempo. Não é necessário sincronizar a respiração com a animação.

## 6. Evidências científicas

As três referências foram verificadas em 24/10/2026. Autores, ano, periódico, DOI, resumo e limitações aparecem na área **Sobre a presença / Pesquisas**, com links às fontes.

- [Goyal e colaboradores, 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4142584/): revisão sistemática; evidência moderada para ansiedade e mais limitada para estresse.
- [Jha, Krompinger e Baime, 2007](https://link.springer.com/article/10.3758/CABN.7.2.109): diferenças em componentes específicos da atenção após programas distintos.
- [Mrazek e colaboradores, 2013](https://pubmed.ncbi.nlm.nih.gov/23538911/): treinamento de duas semanas em universitários; contexto e amostra limitam generalizações.

Nenhum desses estudos avaliou este PWA. Não se promete cura, benefício universal ou efeito clínico de 432 Hz. O texto de boas-vindas foi ajustado para distinguir a força das evidências.

## 7. Arquitetura técnica e dados

```text
React + TypeScript → API Express/Node.js → SQLite persistente
       ↓                       ↓
Motion, SVG, Lottie      link único e sessão HttpOnly
       ↓
HTMLAudioElement → WAV gravado + JSON temporal + VTT
       ↓
Service Worker → shell estático + downloads públicos opcionais
```

SQLite é a escolha proporcional para a primeira implantação de instância única, com volume persistente, WAL e chaves estrangeiras. Não usar arquivo SQLite em disco efêmero/serverless. Para múltiplas instâncias, migrar para PostgreSQL, adaptar transações, limites de requisição e limpeza de registros, e validar a migração antes da implantação.

Tabelas: `users`, `login_tokens`, `sessions`, `attempts`. O banco fica em `.data/`, fora de `dist/` e do pacote de entrega. Tokens e sessões são armazenados como hashes; consultas usam parâmetros. Não há tabela de sintomas, avaliação emocional ou produtividade.

## 8. Autenticação e cadastro

- `POST /api/auth/request`: valida entradas, limita tentativas e gera link de 15 minutos.
- `POST /api/auth/verify`: consome o link uma vez, cria a conta se necessário e emite sessão de 7 dias.
- `GET /api/me`: devolve somente a conta da sessão autenticada.
- `POST /api/logout`: invalida a sessão no servidor.
- `GET /api/export`: exporta os dados da conta autenticada.
- `DELETE /api/account`: exclui a conta, os links e todas as sessões relacionadas.
- `GET /api/content`: fornece os roteiros públicos.

Cookie HttpOnly, SameSite Strict e Secure em produção. Requisições de escrita exigem a origem configurada e JSON. Links usam fragmento de URL e são retirados da barra ao entrar. Não há tokens de autenticação em localStorage. A API usa `Cache-Control: no-store` e o Service Worker não a intercepta.

## 9. Implementação e execução

```sh
npm run dev      # Vite em 127.0.0.1:5173 + API em 127.0.0.1:3001
npm run check    # TypeScript
npm test         # testes de segurança, mídia e cache
npm run build    # tipos + build + manifesto de cache
npm run preview  # build/API na mesma origem, em 127.0.0.1:4173
```

Para trabalhar nos arquivos, use `src/`, `server/`, `public/` e `scripts/`. `dist/` é o resultado compilado. O lockfile pnpm está incluído; para instalações reproduzíveis, use `pnpm install --frozen-lockfile`.

## 10. Animações

Motion respeita a preferência de redução de movimento. O SVG original tem árvores com movimento discreto e uma pessoa sentada. O círculo mostra o estado da contagem sem impor uma cadência. O Lottie usa o player leve, carregado somente no encerramento, sem suporte a expressões via eval.

## 11. Mídias, reprodução e offline

As boas-vindas já usam **Gemini TTS, voz Sulafat**. Os trechos Gemini restantes são produzidos e guardados em SQLite; a meditação já utiliza os trechos Gemini disponíveis e mantém somente o encerramento ainda pendente em voz provisória, identificado na interface. A prática de atenção ao ambiente permanece provisória. Não dependem de síntese em tempo real. Há WAV, legendas VTT e JSON com tempos medidos. O relógio da voz controla as legendas e o estado visual; a pausa interrompe os áudios. A reprodução pausa quando a aba fica oculta, evitando um descompasso involuntário. Existe roteiro completo para leitura, inclusive sem áudio.

A trilha instrumental é uma composição digital original de osciladores senoidais, referência Lá=432 Hz, sem amostras de terceiros. Loop de 32 segundos, com junção em zero e volume inicial inferior ao da voz. Pode ser desligada e ajustada separadamente. A afinação é uma escolha sonora.

No menu Práticas, selecione **Salvar áudio e roteiro offline**. O download é confirmado somente quando narração, JSON e trilha estão completos. A meditação MP3 otimizada tem aproximadamente 2,6 MB; o master WAV local tem aproximadamente 28 MB. O Service Worker atende pedidos Range, necessários para avançar e retomar áudio offline. O shell é instalado separadamente. O cache não contém dados de contas.

Offline, qualquer pessoa pode acessar conteúdos públicos baixados, sem validar uma sessão ou consultar dados da conta. Cadastro, exportação e exclusão exigem conexão. Áudios baixados podem ser removidos em Seu cuidado. O modo offline deve ser testado no build (`preview`), e não no servidor de desenvolvimento Vite.

## 12. Verificação

Consulte [o registro dos testes e limites](docs/12-verificacao.md). Inclui testes de segurança e integridade temporal, fluxo de navegador e medidas de responsividade. Não equivale a certificação WCAG, validação clínica ou auditoria independente.

## 13. Preparação da implantação e pendências

Consulte [o plano de implantação e privacidade](docs/13-implantacao-e-privacidade.md) e [a especificação das mídias finais](docs/midias-e-direitos.md).

Pendências de produção: voz humana profissional e validação de uso das vozes/mídias; eventual vídeo real; configuração SMTP; domínio e HTTPS; controlador e canal de privacidade; bases legais e fornecedores; política de retenção e backups; teste em Android e iPhone reais. Nada foi publicado, contratado ou enviado externamente.

## Continuação diária no Codex

Há uma automação diária neste chat às 9h (Brasília) para concluir e melhorar os áudios, salvar as versões em SQLite e atualizar a prévia após validação. Consulte [as instruções](docs/automacao-diaria.md). A credencial e os bancos permanecem fora do GitHub. Os áudios distribuídos no projeto são MP3 otimizados; masters WAV são locais.
