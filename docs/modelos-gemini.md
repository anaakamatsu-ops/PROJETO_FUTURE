# Geração de voz com Gemini

Geração editorial dos áudios, executada fora do aplicativo. A chave fica somente em memória/ambiente do processo. Não é colocada em `src/`, `public/`, `dist/`, banco de dados ou localStorage. Não existe chamada Gemini a cada meditação ouvida.

Consulta autenticada ao catálogo em 24/10/2026 confirmou, para a chave fornecida, os modelos `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts`, `gemini-3.1-flash-tts-preview`, variantes TTS 2.5, os Flash 3.5–3.8, Flash-Lite 3.5 e Gemma 4. A presença no catálogo não garante saldo de cota nem define o plano de faturamento.

## Escolha por capacidade

- Voz: `gemini-3.8-flash-lite-tts`, voz predefinida Sulafat, orientação de português brasileiro e tom sereno. Alternativas de voz no mesmo projeto: TTS 3.8 Flash, 3.1 Flash TTS Preview e 2.5 Flash Preview TTS, conforme disponibilidade e cotas próprias.
- Texto: Flash 3.8, 3.7, 3.6, 3.5, Flash-Lite e Gemma podem ser avaliados para tarefas editoriais futuras. Não são fallback de voz. O MVP não precisa dessas chamadas para funcionar.
- O gerador respeita o limite de cada modelo. Em limite diário de um modelo, usa somente as cotas próprias disponíveis de outras alternativas TTS autorizadas. Em limite compartilhado do projeto, interrompe. Não cria chaves, projetos ou contas adicionais.

## Economia de requisições

Uma geração por trecho permite medir a duração real e sincronizar as legendas sem estimar palavras por minuto. São 41 trechos reutilizáveis para as três experiências. Cada trecho pronto é armazenado por hash de texto, modelo, voz e estilo; retomar não gera novamente o que já está no cache. Reproduzir os WAVs consome zero chamadas de geração.

`scripts/generate-gemini.ts` possui limite local de 50 tentativas por execução e espaçamento padrão de 22 s. Estes são controles locais, não promessas sobre a cota disponível. Em limite temporário, respeita espera; em limite diário de um modelo, registra o próximo horário elegível e não repete chamadas para aquele modelo. Não cria projetos, chaves, planos ou contas adicionais para ampliar limites.

```sh
# Defina GEMINI_API_KEY no ambiente do processo, fora do histórico de comandos.
node scripts/generate-gemini.ts --sample
node scripts/generate-gemini.ts
node scripts/assemble-media.ts --gemini
npm test
npm run build
```

Sem variável, o script solicita a credencial em entrada sem eco. Para geração por lote, use terminal interativo. Não passe a chave em argumento de linha de comando. O cache e o manifesto ficam em `work/`, ignorados pelo versionamento; somente os arquivos finais públicos entram no build.

## Faixa gratuita e limites

A tabela oficial consultada lista faixa gratuita para os dois TTS 3.8. A API usa o projeto associado à chave: não há neste gerador um seletor capaz de transformar um projeto faturado em gratuito. Manter o projeto na faixa desejada e verificar suas cotas no AI Studio. Não foi feito upgrade nem contratado serviço.

Enviar somente os roteiros públicos. Não enviar dados de funcionários, relatos emocionais ou informações clínicas. Os termos da faixa gratuita podem permitir uso de conteúdo para melhoria de produtos, conforme o serviço e a região. A narração permanece identificada como voz sintética.

Fontes oficiais consultadas em 24/10/2026: [geração de fala](https://ai.google.dev/gemini-api/docs/speech-generation), [Flash-Lite TTS](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-lite-tts), [preços e faixa gratuita](https://ai.google.dev/gemini-api/docs/pricing), [consulta de modelos](https://ai.google.dev/api/models).
