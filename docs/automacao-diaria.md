# Automação diária no Codex

A automação deste chat verifica a fila todos os dias às 9h (America/Sao_Paulo). É uma tarefa local: mantenha o computador ligado e o Codex aberto para acessar os arquivos. Não foi criado um agendamento do Windows ao ligar o PC, pois o agendamento dentro do Codex está disponível.

Comando: node scripts/daily-audio.ts. Diagnóstico sem API: node scripts/daily-audio.ts --dry-run. Verificação da credencial sem exibi-la: node scripts/daily-audio.ts --check-secret.

O banco fica no diretório outputs, como banco-audios.sqlite, fora do repositório público. Guarda BLOBs de áudio e metadados em audio_assets, seleção em current_audio, fila em audio_jobs e execuções em automation_runs. O histórico é preservado. Prioridade: concluir trechos ausentes e depois substituir versões inferiores por gemini-3.8-flash-tts, sem gerar novamente o que já está pronto nesse modelo.

A chave fica cifrada com Windows DPAPI, vinculada ao usuário Windows, em work/secrets/gemini.dpapi na pasta deste chat, fora do projeto e do GitHub. O script filho recebe a chave somente em memória. Em outro computador, configure uma nova credencial local por scripts/store-secret.mjs ou pelo ambiente do processo.

A fila respeita os horários de liberação informados pela API e não altera faturamento. A automação não contrata serviços, não publica o PWA e não envia mensagens. O agendamento do Codex não é exportado para o GitHub; os scripts e estas instruções são.

Se a geração avançar, o script importa as novas versões no banco. Quando todos os trechos necessários estiverem disponíveis, monta o áudio, atualiza JSON/VTT, codifica MP3, executa testes e reconstrói a prévia. A chave protegida não faz parte de backups públicos. Para codificação, o ambiente local usa imageio-ffmpeg em work/ffmpeg-runtime; em outra máquina, configure FFMPEG_PATH.
