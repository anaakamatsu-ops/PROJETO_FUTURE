# Registro de verificação — 24/10/2026

História verificada: convite → formulário → API → SQLite → sessão → boas-vindas → meditação → contagem de dez → retorno ao ambiente → encerramento.

## Verificações automatizadas

TypeScript sem erros. Build Vite concluído. Nove testes com o runner nativo do Node verificam validação e origem, link único e expiração, sessão HttpOnly/SameSite, acesso por titular, exclusão, logout, limitação de pedidos, bloqueio de produção sem configuração, integridade da linha do tempo e entrega Range offline.

## Navegador

- Conta de teste fictícia demonstracao@exemplo.test: cadastro e entrada confirmados no ambiente local. Nenhuma mensagem enviada.
- Boas-vindas: voz gravada reproduzida após toque; legenda sincronizada visível; pausa e avanço disponíveis.
- Player: voz e música com readyState 4 e sem erro de áudio; pausa, visualização abstrata e avanço por barra testados.
- A décima respiração apareceu com texto e estado 10 de 10. O trecho seguinte convidou a abrir os olhos lentamente. O evento de fim do áudio levou à tela final automaticamente, sem exigir resposta emocional.
- Download: a meditação e seus recursos foram salvos e a interface confirmou o download completo.
- Histórico desligado por padrão. Diálogo de instalação abriu e fechou por Escape. Botões sem nome acessível: zero na tela inicial inspecionada.
- Console: sem avisos ou erros nas verificações do fluxo.

## Responsividade

| Viewport | Largura medida do documento | Resultado observado |
|---|---:|---|
| 320 px | 305 px | Sem transbordamento horizontal no início, privacidade e pesquisas |
| 390 px | 375 px | Sem transbordamento horizontal; player e cadastro utilizáveis |
| 768 px | 753 px | Layout de tablet sem transbordamento horizontal |
| 1440 px | 1425 px | Navegação e grade de computador sem transbordamento horizontal |

A diferença de 15 px corresponde à barra de rolagem do navegador de teste. Capturas em docs/previews. O viewport temporário foi restaurado depois do teste.

## Limites da verificação

Não foram usados aparelhos Android/iPhone físicos, leitor de tela real ou ferramentas de auditoria WCAG completas. A instalação nativa e a abertura pelo WhatsApp devem ser verificadas nesses aparelhos antes do piloto. HTTPS, entrega SMTP, backups e procedimentos da organização dependem da implantação ainda não autorizada. Não houve avaliação clínica do aplicativo. O teste automatizado de Range e o download real não substituem o teste de modo avião em aparelhos reais.
