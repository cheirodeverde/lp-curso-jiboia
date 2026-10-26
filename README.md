# LP Curso Jiboia 7D

Landing page do curso **Método Jiboia 7D**, da Cheiro de Verde.

Site estático, sem build: `index.html` (LP), `privacidade.html` (Política de Privacidade), `cookies.js` (aviso de cookies/LGPD) e `img/`. Publicado na Vercel; `vercel.json` ativa URLs limpas (`/privacidade`).

## Pendências

- **Vídeo de prévia:** a seção está oculta. Para ativar, troque `SEU_VIDEO_ID` pelo ID do YouTube e remova o atributo `hidden` da seção.
- **Razão social:** a Política de Privacidade (`privacidade.html`) usa "Cheiro de Verde"; trocar pela razão social do CNPJ.
- **Rastreamento:** Google Analytics, Meta Pixel e Google Ads ainda não estão instalados. Os códigos entram em `cookies.js` (funções `loadAnalytics` e `loadMarketing`), para só rodarem depois do consentimento.
