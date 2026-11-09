/* Clínica Serena — comportamento da página (JavaScript puro) */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initAccordion();
  initBookingForm();
});

/* ---------- RF01: menu mobile ---------- */
function initMenu() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu-principal');
  if (!header || !toggle || !nav) return;

  const desktopQuery = window.matchMedia('(min-width: 769px)');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => setMenu(!isOpen()));

  // Fecha o painel ao escolher um link
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  // Esc fecha e devolve o foco ao botão
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Clique fora do cabeçalho fecha o painel
  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) setMenu(false);
  });

  // Com teclado, sair do cabeçalho (Tab) também fecha o painel
  header.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });

  // Ao voltar para o desktop, garante o estado fechado
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

/* ---------- RF02: acordeão do FAQ ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
}

/* ---------- RF03 / RF04: validação e envio simulado ---------- */
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99
]);

/* Sem espaços e hífens: +55 opcional, DDD (com ou sem parênteses e 0 opcional) e 8 ou 9 dígitos */
const PHONE_SHAPE = /^(?:\+?55)?(?:\(0?\d{2}\)|0?\d{2})\d{8,9}$/;

const EMAIL_PATTERN =/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

function validateName(value) {
  const name = value.trim();
  if (name === '') return 'Informe seu nome (espaços em branco não são aceitos).';
  if (name.length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
  if (!/\p{L}/u.test(name)) return 'Digite um nome válido, com letras.';
  return '';
}

function validateEmail(value) {
  const email = value.trim();
  if (email === '') return 'Informe seu e-mail.';
  const [local = ''] = email.split('@');
  const hasBadDots = email.includes('..') || local.startsWith('.') || local.endsWith('.');
  if (!EMAIL_PATTERN.test(email) || hasBadDots) {
    return 'Digite um e-mail válido, por exemplo: nome@email.com.';
  }
  return '';
}

/* Retorna os 10 ou 11 dígitos nacionais (DDD + número) ou null */
function normalizePhone(value) {
  const raw = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(raw)) return null;

  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    if (!digits.startsWith('55')) return null;
    digits = digits.slice(2);
  } else if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  } else if ((digits.length === 11 || digits.length === 12) && digits.startsWith('0')) {
    digits = digits.slice(1); // prefixo 0 de ligação interurbana
  }
  return digits;
}

function validatePhone(value) {
  const raw = value.trim();
  if (raw === '') return 'Informe seu telefone com DDD.';

  const example = 'Use o formato (27) 99999-0000 ou (27) 3333-0000.';
  if (!/^\+?[\d\s()-]+$/.test(raw)) return `Use apenas números, parênteses, espaços ou hífen. ${example}`;

  const digits = normalizePhone(raw);
  if (digits === null) return 'Informe um telefone brasileiro (código +55).';
  if (digits.length !== 10 && digits.length !== 11) return `Informe o DDD e o número completo. ${example}`;
  if (!PHONE_SHAPE.test(raw.replace(/[\s-]/g, ''))) return `Use parênteses apenas em volta do DDD. ${example}`;
  if (!VALID_DDDS.has(Number(digits.slice(0, 2)))) return 'O DDD informado não é válido no Brasil.';

  const number = digits.slice(2);
  if (number.length === 9 && number[0] !== '9') return 'Celulares com 9 dígitos começam com 9 após o DDD.';
  if (number.length === 8 && !/[2-5]/.test(number[0])) return 'Telefones fixos começam com 2, 3, 4 ou 5 após o DDD.';
  return '';
}

function formatPhone(value) {
  const digits = normalizePhone(value);
  if (!digits) return value;
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  const split = number.length - 4;
  return `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`;
}

function validateConsent(checked) {
  return checked
    ? ''
    : 'Para enviar, marque a autorização de uso dos dados para contato.';
}

function initBookingForm() {
  const form = document.getElementById('form-agendamento');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const feedback = document.getElementById('form-feedback');
  const submitLabel = submitButton.textContent;

  const fields = [
    { input: form.elements.nome, validate: (el) => validateName(el.value) },
    { input: form.elements.email, validate: (el) => validateEmail(el.value) },
    { input: form.elements.telefone, validate: (el) => validatePhone(el.value) },
    { input: form.elements.consentimento, validate: (el) => validateConsent(el.checked) }
  ];

  // Mensagens exibidas sempre com textContent (sem innerHTML)
  function setError(input, message) {
    const errorElement = document.getElementById(`${input.id}-erro`);
    errorElement.textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function checkField(field) {
    const message = field.validate(field.input);
    setError(field.input, message);
    return message === '';
  }

  // Uma confirmação anterior sai de cena quando um novo preenchimento começa
  form.addEventListener('input', () => {
    if (!feedback.hidden) {
      feedback.hidden = true;
      feedback.textContent = '';
    }
  });

  fields.forEach((field) => {
    const { input } = field;

    if (input.type === 'checkbox') {
      input.addEventListener('change', () => checkField(field));
      return;
    }

    // Valida ao sair do campo (se algo foi digitado) e corrige em tempo real depois de um erro
    input.addEventListener('blur', () => {
      if (input.value.trim() === '' && !input.hasAttribute('aria-invalid')) return;
      const valid = checkField(field);
      if (valid && input.name === 'telefone') input.value = formatPhone(input.value);
    });

    input.addEventListener('input', () => {
      if (input.hasAttribute('aria-invalid')) checkField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.hidden = true;
    feedback.textContent = '';

    const invalid = fields.filter((field) => !checkField(field));
    if (invalid.length > 0) {
      invalid[0].input.focus();
      return;
    }

    const firstName = form.elements.nome.value.trim().split(/\s+/)[0];

    // Envio simulado: nenhum dado sai do navegador
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    form.setAttribute('aria-busy', 'true');

    window.setTimeout(() => {
      form.reset();
      fields.forEach((field) => setError(field.input, ''));
      submitButton.disabled = false;
      submitButton.textContent = submitLabel;
      form.removeAttribute('aria-busy');

      feedback.textContent = `Solicitação enviada, ${firstName}! Entraremos em contato em breve para combinar o melhor dia e horário.`;
      feedback.hidden = false;
      feedback.focus();
    }, 800);
  });
}
