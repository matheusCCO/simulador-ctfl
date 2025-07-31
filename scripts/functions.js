// JavaScript principal do Simulador CTFL

let currentQuestions = [];
let timer;
let remainingTime = 60 * 60;
let simulados = {};

const simuladosArquivos = [
  'Simulados/SimuladoA (Oficial BSTQB).json',
  'Simulados/SimuladoB (Oficial BSTQB).json',
  'Simulados/SimuladoC (Oficial BSTQB).json',
  'Simulados/SimualdoF (Inspirado no Simulado A feito por IA).json'
];

const MODO_ALEATORIO_ID = 'aleatorio_40';
const MODO_ALEATORIO_LABEL = 'Modo Aleatório (40 questões embaralhadas dos 3 simulados)';

function inicializarSimuladosDropdown() {
  const examSelect = document.getElementById('examSelect');
  examSelect.innerHTML = '';
  simulados = {};
  // Adiciona opção Aleatória
  const optAleatorio = document.createElement('option');
  optAleatorio.value = MODO_ALEATORIO_ID;
  optAleatorio.textContent = MODO_ALEATORIO_LABEL;
  optAleatorio.className = 'font-bold bg-yellow-100';
  examSelect.appendChild(optAleatorio);
  // Adiciona os simulados normais
  simuladosArquivos.forEach((arquivo, idx) => {
    const nome = arquivo.replace(/^Simulados\//, '').replace(/\.json$/i, '').replace(/_/g, ' ');
    const id = 'sim_' + idx;
    simulados[id] = {
      nome,
      arquivo,
      questoes: null,
      importado: false
    };
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = nome;
    examSelect.appendChild(opt);
  });
}

async function startQuiz() {
  // Corrige bug do timer duplicado: limpa o timer anterior antes de iniciar um novo
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  const selected = document.getElementById("examSelect").value;
  if (selected === MODO_ALEATORIO_ID) {
    try {
      const arquivos = [
        'Simulados/SimuladoA (Oficial BSTQB).json',
        'Simulados/SimuladoB (Oficial BSTQB).json',
        'Simulados/SimuladoC (Oficial BSTQB).json'
      ];
      let todasQuestoes = [];
      for (const arquivo of arquivos) {
        const resp = await fetch(arquivo);
        if (!resp.ok) throw new Error('Erro ao carregar ' + arquivo);
        const data = await resp.json();
        if (Array.isArray(data)) {
          todasQuestoes = todasQuestoes.concat(data);
        } else if (Array.isArray(data.questoes)) {
          todasQuestoes = todasQuestoes.concat(data.questoes);
        }
      }
      for (let i = todasQuestoes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [todasQuestoes[i], todasQuestoes[j]] = [todasQuestoes[j], todasQuestoes[i]];
      }
      currentQuestions = todasQuestoes.slice(0, 40);
    } catch (e) {
      alert('Erro ao carregar questões do modo aleatório: ' + e.message);
      return;
    }
  } else {
    let simulado = simulados[selected];
    if (!simulado) {
      alert('Simulado não encontrado.');
      return;
    }
    if (simulado.importado) {
      currentQuestions = simulado.questoes;
    } else {
      if (simulado.questoes) {
        currentQuestions = simulado.questoes;
      } else {
        try {
          const response = await fetch(simulado.arquivo);
          if (!response.ok) throw new Error('Erro ao carregar ' + simulado.arquivo);
          const data = await response.json();
          if (Array.isArray(data)) {
            currentQuestions = data;
          } else if (Array.isArray(data.questoes)) {
            currentQuestions = data.questoes;
          } else {
            currentQuestions = [];
          }
          simulados[selected].questoes = currentQuestions;
        } catch (e) {
          alert('Erro ao carregar questões do simulado: ' + e.message);
          return;
        }
      }
    }
  }
  if (!currentQuestions || currentQuestions.length === 0) {
    alert("Esse exame ainda não tem questões disponíveis.");
    return;
  }
  document.getElementById("quiz").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  renderQuestions();
  startTimer();
}

// Importação de JSON para cadastrar novos simulados

document.addEventListener('DOMContentLoaded', () => {
  inicializarSimuladosDropdown();
  const importBtn = document.getElementById('importBtn');
  const importInput = document.getElementById('importJson');
  const examSelect = document.getElementById('examSelect');
  importBtn.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const data = JSON.parse(ev.target.result);
        let questoes = Array.isArray(data) ? data : data.questoes;
        if (!Array.isArray(questoes) || !questoes.length) throw new Error('Arquivo sem questões válidas.');
        const id = 'simulado_' + Date.now();
        simulados[id] = {
          nome: file.name.replace(/\.json$/i, ''),
          arquivo: null,
          questoes,
          importado: true
        };
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = simulados[id].nome + ' (importado)';
        opt.className = 'bg-blue-50 text-blue-900 font-semibold';
        examSelect.appendChild(opt);
        examSelect.value = id;
        alert('Simulado importado com sucesso!');
      } catch (err) {
        alert('Erro ao importar JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  examSelect.addEventListener('change', () => {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
  });
});

function renderQuestions() {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "";
  currentQuestions.forEach((q, i) => {
    const qDiv = document.createElement("div");
    const level = (q.level || q.nivel || '').toUpperCase();
    qDiv.className = `mb-4 p-4 rounded bg-gray-50 ${level ? 'k'+level[1] : ''}`;
    const texto = q.questao || q.questão || q.question || '';
    let alternativas = [];
    let letras = [];
    if (Array.isArray(q.alternativas)) {
      alternativas = q.alternativas;
      letras = alternativas.map((_, idx) => String.fromCharCode(65 + idx));
    } else if (q.alternativas && typeof q.alternativas === 'object') {
      letras = Object.keys(q.alternativas);
      alternativas = letras.map(letra => q.alternativas[letra]);
    } else if (Array.isArray(q.options)) {
      alternativas = q.options;
      letras = alternativas.map((_, idx) => String.fromCharCode(65 + idx));
    }
    const isCheckbox = (q.tipo && q.tipo.toLowerCase().includes('checkbox')) || q.multiple === true;
    let html = `<p class="font-semibold flex items-center gap-2">${i + 1}. ${texto} `;
    if (level) {
      html += `<span class="inline-block align-middle text-xs font-bold px-2 py-1 rounded-full border border-gray-400 shadow-sm ml-2 ${level ? 'k'+level[1] : ''}" style="min-width:2.5em;text-align:center;">${level}</span>`;
    }
    html += `</p>`;
    if (Array.isArray(q.imagens) && q.imagens.length > 0) {
      html += '<div class="flex flex-col items-center">';
      q.imagens.forEach(img => {
        html += `<img src="${img}" alt="Imagem da questão" class="mt-2" style="width:500px;max-width:100%;height:auto;" />`;
      });
      html += '</div>';
    }
    if (isCheckbox) {
      html += letras.map((letra, j) => `
        <label class="block mt-2 cursor-pointer">
          <input type="checkbox" name="q${i}" value="${letra}" class="mr-2" /> <span class="font-mono">${letra}</span>) ${alternativas[j]}
        </label>
      `).join("");
    } else {
      html += letras.map((letra, j) => `
        <label class="block mt-2 cursor-pointer">
          <input type="radio" name="q${i}" value="${letra}" class="mr-2" /> <span class="font-mono">${letra}</span>) ${alternativas[j]}
        </label>
      `).join("");
    }
    qDiv.innerHTML = html;
    container.appendChild(qDiv);
  });
}

function stopTimer() {
  clearInterval(timer);
}

function startTimer() {
  // Sempre limpa o timer anterior antes de iniciar um novo
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  remainingTime = 60 * 60;
  updateTimer();
  timer = setInterval(() => {
    remainingTime--;
    updateTimer();
    if (remainingTime <= 0) {
      clearInterval(timer);
      timer = null;
      alert("Tempo esgotado!");
      submitQuiz();
    }
  }, 1000);
}

function updateTimer() {
  const min = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const sec = (remainingTime % 60).toString().padStart(2, '0');
  document.getElementById("timer").textContent = `Tempo: ${min}:${sec}`;
}

function submitQuiz() {
  clearInterval(timer);
  let acertos = 0;
  let total = currentQuestions.length;
  let html = '';
  currentQuestions.forEach((q, i) => {
    const userAnswers = Array.from(document.querySelectorAll(`[name='q${i}']:checked`)).map(el => el.value);
    let correta = q.correta || q.answer;
    let isCheckbox = (q.tipo && q.tipo.toLowerCase().includes('checkbox')) || q.multiple === true;
    let corretaArr = [];
    if (Array.isArray(correta)) {
      corretaArr = correta.map(String);
    } else if (typeof correta === 'string' && correta.includes(',')) {
      corretaArr = correta.split(',').map(s => s.trim());
    } else if (typeof correta === 'string') {
      corretaArr = [correta.trim()];
    } else if (typeof correta === 'number') {
      corretaArr = [String(correta)];
    }
    let acertou = false;
    if (isCheckbox) {
      acertou = userAnswers.length === corretaArr.length && userAnswers.every(a => corretaArr.includes(a));
    } else {
      acertou = userAnswers.length === 1 && corretaArr.includes(userAnswers[0]);
    }
    if (acertou) acertos++;
    const level = (q.level || q.nivel || '').toUpperCase();
    html += `<div class="mb-4 p-4 rounded bg-gray-50 border ${acertou ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}">`;
    html += `<p class="font-semibold flex items-center gap-2">${i + 1}. ${(q.questao || q.questão || q.question || '')}`;
    if (level) {
      html += `<span class="inline-block align-middle text-xs font-bold px-2 py-1 rounded-full border bg-Se border-gray-400 shadow-sm ml-2 ${level ? 'k'+level[1] : ''}" style="min-width:2.5em;text-align:center;">${level}</span>`;
    }
    html += `</p>`;
    if (Array.isArray(q.imagens) && q.imagens.length > 0) {
      html += '<div class="flex flex-col items-center">';
      q.imagens.forEach(img => {
        html += `<img src="${img}" alt="Imagem da questão" class="mt-2" style="width:500px;max-width:100%;height:auto;" />`;
      });
      html += '</div>';
    }
    html += `<div class="mt-2">Sua resposta: <span class="font-mono">${userAnswers.join(', ') || '-'}</span></div>`;
    html += `<div class="mt-1">Correta: <span class="font-mono">${corretaArr.join(', ')}</span></div>`;
    html += acertou ? `<div class="text-green-700 font-bold">✔ Acertou</div>` : `<div class="text-red-700 font-bold">✘ Errou</div>`;
    html += `</div>`;
  });
  const nota = Math.round((acertos / total) * 100);
  const erros = total - acertos;
  const aprovado = nota >= 65;
  const tentativa = {
    data: new Date().toLocaleString(),
    nota,
    acertos,
    erros,
    total,
    aprovado
  };
  let historico = [];
  try {
    historico = JSON.parse(localStorage.getItem('ctfl_historico') || '[]');
  } catch {}
  historico.unshift(tentativa);
  localStorage.setItem('ctfl_historico', JSON.stringify(historico.slice(0, 10)));
  renderHistory();
  setTimeout(() => {
    alert(`${aprovado ? '✅ Parabéns, você foi APROVADO!' : '❌ Você NÃO foi aprovado.'}\n\nAcertos: ${acertos}\nErros: ${erros}\nNota: ${nota}%`);
  }, 100);
  html = `<div class="mb-4 text-lg font-bold">Nota: ${nota}% (${acertos} acertos, ${erros} erros de ${total} questões) - ${aprovado ? '<span class=\'text-green-700\'>APROVADO</span>' : '<span class=\'text-red-700\'>REPROVADO</span>'}</div>` + html;
  document.getElementById("result").innerHTML = html;
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("quiz").classList.add("hidden");
}

function renderHistory() {
  let historico = [];
  try {
    historico = JSON.parse(localStorage.getItem('ctfl_historico') || '[]');
  } catch {}
  const ul = document.getElementById('historyList');
  if (!ul) return;
  ul.innerHTML = '';
  if (!historico.length) {
    ul.innerHTML = '<li class="text-gray-500">Nenhuma tentativa registrada ainda.</li>';
    return;
  }
  historico.forEach((t, idx) => {
    ul.innerHTML += `<li class="mb-1">${t.data}: <b>${t.nota}%</b> (${t.acertos} acertos, ${t.erros} erros) - ${t.aprovado ? '<span class=\'text-green-700\'>APROVADO</span>' : '<span class=\'text-red-700\'>REPROVADO</span>'}</li>`;
  });
}

window.addEventListener('DOMContentLoaded', renderHistory);
