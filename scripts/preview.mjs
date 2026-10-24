// Prévia local do build, com API e PWA na mesma origem. Não envia e-mails.
process.env.NODE_ENV='development';
process.env.PORT='4173';
process.env.HOST='127.0.0.1';
process.env.APP_ORIGIN='http://127.0.0.1:4173';
process.env.DB_PATH='.data/preview.sqlite';
await import('../server/index.ts');
