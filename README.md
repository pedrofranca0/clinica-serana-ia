# Clínica Serena — landing page

Projeto acadêmico. **Nome, textos, endereço, contatos e ilustrações são fictícios.**
A clínica não existe, não atende emergências e o formulário não envia dados a nenhum servidor (envio simulado no navegador).

## Como abrir

Abra `index.html` no navegador. Não há etapa de build nem dependências; as fontes Nunito e Nunito Sans são carregadas do Google Fonts (sem internet, o navegador usa uma fonte de sistema).

## Estrutura

```
index.html                 Landing page (6 seções)
politica-privacidade.html  Política de Privacidade (link do formulário e do rodapé)
css/style.css              Estilos (tokens, componentes, seções, responsivo)
js/script.js               Menu mobile, acordeão do FAQ, validação e envio simulado
img/                       PNGs fornecidos com o projeto
```

## Fontes das imagens

Todas as imagens vêm do pacote `img.zip` entregue com o enunciado (descrito no LEIAME do projeto). Nenhuma imagem externa, banco de imagens, emoji ou biblioteca de ícones foi usada.

| Arquivo | Uso | Dimensão original |
| --- | --- | --- |
| `img/logo-icone.png` | Logo do cabeçalho e favicon | 100 × 100 |
| `img/logo-icone-claro.png` | Logo do rodapé (fundo escuro) | 100 × 100 |
| `img/hero-desktop.png` | Ilustração do hero acima de 768 px (exibida em 480 × 420) | 1500 × 1313 |
| `img/hero-mobile.png` | Ilustração do hero até 768 px (proporção 350 × 240) | 1094 × 750 |
| `img/icone-individual.png` | Card "Terapia individual" | 75 × 75 |
| `img/icone-casal.png` | Card "Terapia de casal" | 75 × 75 |
| `img/icone-online.png` | Card "Atendimento online" | 75 × 75 |
| `img/icone-menu.png` | Botão hambúrguer (mobile) | 75 × 75 |

O selo "Imagem ilustrativa", o "+/−" do FAQ e os cantos arredondados do hero são feitos em HTML/CSS.

## Textos provisórios

Seguindo a referência visual, alguns dados aparecem como marcadores claramente demonstrativos: `[PRAZO]`, `[ENDEREÇO DA CLÍNICA]` e `[E-MAIL DE CONTATO]`. Substitua-os por valores fictícios, se o avaliador preferir.

## Validação (auditoria de 07/11/2026)

- W3C HTML (validator.w3.org/nu): `index.html` e `politica-privacidade.html` com 0 erros e 0 avisos.
- W3C CSS (jigsaw, perfil CSS3 + SVG): 0 erros; 5 avisos informativos ("CSS variables are currently not statically checked").
- Testes automatizados (Playwright/Chromium): 129 verificações de auditoria + 61 de regressão, todas aprovadas (navegação, menu, FAQ, formulário, LGPD, 360/768/1280 px).
- Métricas medidas com CPU 4× mais lenta e rede de 1,6 Mbps (sem o Google Fonts): FCP/LCP 0,74 s, CLS 0, TBT 18 ms. Troca de fonte (Segoe UI → Nunito) com CLS de pior caso de 0,0067.
- Lighthouse: **pendente**. Rodar no Chrome (DevTools > Lighthouse) com a página servida localmente, por exemplo com a extensão Live Server do VS Code.

## Emergências

O rodapé informa: CVV 188 (24 horas) e SAMU 192.
