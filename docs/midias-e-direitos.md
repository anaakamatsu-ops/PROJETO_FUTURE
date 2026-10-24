# Mídias entregues e produção final

| Recurso | Situação |
|---|---|
| Paisagem `public/images/jardim.webp` | Gerada especificamente para o app, com a ferramenta integrada image_gen; otimizada em WebP |
| Marca, ícones e jardim com pessoa sentada | SVG original escrito no projeto |
| Folha de encerramento | Lottie original descrito no código, com versão estática |
| Boas-vindas, meditação e atenção ao ambiente | Voz **sintética** Microsoft Maria Desktop, gravada no Windows; WAVs reais, VTTs e tempos JSON |
| Trilha | Composição digital original, sem samples, referência Lá=432 Hz, loop de 32 s |
| Narração humana profissional | **Pendente** |
| Vídeo real de pessoa meditando | **Não produzido**; substituído por animação vetorial, conforme alternativa autorizada no pedido |

Os arquivos da voz sintética servem à demonstração local. Antes de redistribuição comercial, revisar os termos aplicáveis à voz Microsoft e obter autorização/licença necessária, ou substituir por narração contratada com cessão apropriada. Não alegar que a presença do arquivo resolve direitos de uso.

## Especificação da narração humana

Voz preferencialmente feminina em pt-BR, acolhedora, clara e natural, com pausas perceptíveis e sem tom de comando. Gravar o roteiro de `docs/05-roteiro-e-timeline.md` em ambiente sem ruído. Preservar a sequência 1–10 e o convite posterior para abrir os olhos lentamente. Não inserir retenções de ar ou aprofundamento obrigatório.

Master WAV mono PCM 48 kHz/24 bits, sem clipping, loudness integrado próximo de -18 LUFS e pico verdadeiro até -1 dBTP como ponto de partida de mixagem. Exportar versão de entrega compatível com Safari/Chrome (por exemplo AAC em M4A) e atualizar o campo `url` nos JSONs. Produzir novo VTT e medir novamente todos os tempos de `start`, `voiceEnd` e `end`. Validar duração total de 8–12 min e inteligibilidade com a trilha em smartphones.

Não apenas trocar o arquivo sem refazer o JSON: as legendas e o estado da contagem dependem desses tempos. A duração e as pausas devem ser ajustadas à voz final, sem time stretching extremo. Documentar intérprete, consentimento para uso da voz, cessão/licença, prazo e escopo de distribuição.

## Especificação de vídeo opcional

Pessoa adulta em postura confortável, roupa simples, jardim ao amanhecer, câmera estável, movimento vegetal discreto, sem cortes bruscos. Obter autorização de imagem e licenças de todos os elementos. Preparar enquadramentos 9:16 e 16:9, H.264/MP4, sem áudio incorporado. Usar poster WebP, respeitar movimento reduzido e fornecer sempre a alternativa abstrata. Evitar baixar vídeo por padrão; exigir escolha explícita para uso offline e informar tamanho.

## Prompt da imagem original

Ferramenta: **image_gen integrada**, sem CLI/API externa. Prompt usado:

> Create one original photorealistic cinematic nature landscape for the meditation web app Aqui e Agora. Wide 3:2 image. A quiet, intimate Brazilian-inspired garden at early morning: a still jade-green pond in foreground, layered graceful trees and soft foliage in sage and deep forest green, a small natural stone platform beside the water, a pale warm sunbeam cutting through subtle morning mist. Restrained editorial photography, muted natural colors, warm off-white light, tactile film grain, highly realistic, contemplative, elegant. Rich shaded foreground at lower edges with open luminous sky near upper middle. No people, no text, no lettering, no logos, no UI. This will be cropped as an immersive responsive image. Return/save the resulting image asset so it can be integrated in the local app.

O uso dos pacotes de software deve respeitar as licenças de cada dependência. Não há músicas de catálogo ou gravações humanas apresentadas como licenciadas sem contrato.
