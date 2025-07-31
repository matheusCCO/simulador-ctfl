
# 📋 Simulador CTFL v4.0 - Exame Oficial ISTQB

## ✅ Questões Oficiais Incluídas

Este projeto traz um simulado do exame **ISTQB CTFL v4.0** (Certified Tester Foundation Level) com as **40 questões oficiais do Exame A**, extraídas diretamente do PDF oficial, incluindo as respostas corretas conforme o gabarito.

## 🎯 Sobre o Projeto

O objetivo é permitir que candidatos pratiquem para a certificação ISTQB CTFL v4.0, simulando a experiência do exame real.

## ✨ Características

- 40 questões oficiais do Exame A (CTFL v4.0)
- Questões categorizadas por nível de conhecimento (K1-K4)
- Tempo de 60 minutos por simulado (padrão ISTQB)
- Nota mínima para aprovação: 65% (26 de 40)
- Interface responsiva e similar ao exame oficial
- Timer regressivo
- Relatório de desempenho ao final da tentativa
- Histórico de tentativas salvo no navegador (LocalStorage)

## 🚀 Como Usar

1. Abra o arquivo `index.html` no seu navegador.
2. Clique em "Iniciar Quiz" para começar o simulado oficial (Exame A).
3. Responda às 40 questões dentro do tempo limite.
4. Clique em "Finalizar Tentativa" para ver seu resultado e análise de desempenho.
5. Consulte o histórico de tentativas na mesma página.

> **Atenção:** No momento, apenas o Exame A (oficial) está disponível. Outros exames e funcionalidades avançadas citadas anteriormente ainda não estão implementados.

## Estrutura das Questões

Cada questão possui:

- Enunciado
- Alternativas (única ou múltipla escolha)
- Nível de conhecimento (K1, K2, K3, K4)
- Resposta correta

**Níveis de conhecimento:**

- K1 (Lembrar): fundo amarelo
- K2 (Entender): fundo azul
- K3 (Aplicar): fundo vermelho
- K4 (Analisar): fundo roxo

## Critério de Aprovação

- Nota mínima: 65%
- Tempo limite: 60 minutos
- 40 questões por tentativa

## Tecnologias Utilizadas

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript vanilla
- LocalStorage para persistência do histórico

## Como criar seu próprio arquivo de questões (JSON)


O simulador lê um arquivo JSON no formato abaixo. Você pode criar novos simulados seguindo este padrão e salvando como, por exemplo, `SimuladoB.json`.

**Exemplo de estrutura mínima:**

```json
{
  "questoes": [
    {
      "id": "01",
      "questao": "Enunciado da questão aqui.",
      "alternativas": {
        "A": "Texto da alternativa A",
        "B": "Texto da alternativa B",
        "C": "Texto da alternativa C",
        "D": "Texto da alternativa D"
      },
      "correta": "A", // ou ["A", "B"] para múltipla escolha
      "tipo": "Radio button", // ou "Checkbox" para múltipla escolha
      "imagens": [], // array de caminhos para imagens (pode ser vazio)
      "level": "K1" // K1, K2, K3 ou K4
    }
    // ...outras questões...
  ]
}
```

**Campos obrigatórios por questão:**
- `id`: identificador único
- `questao`: enunciado
- `alternativas`: objeto com letras e textos das opções
- `correta`: letra(s) da(s) resposta(s) correta(s) (ex: "A" ou ["A", "B"])
- `tipo`: "Radio button" (única escolha) ou "Checkbox" (múltipla escolha)
- `level`: nível de conhecimento (K1, K2, K3, K4)
- `imagens`: array de caminhos para imagens (pode ser vazio)

**Observações:**
- O campo `alternativas` agora é sempre um objeto (letra: texto).
- O campo `imagens` é sempre um array (mesmo que não haja imagens).
- O campo `correta` pode ser string (única escolha) ou array (múltipla escolha).

Salve o arquivo na mesma pasta do `index.html` e ajuste o código para carregar o novo arquivo, se desejar.
```
{
  "questoes": [
    {
      "id": "01",
      "questao": "Qual o principal objetivo do teste de software?",
      "alternativas": {
        "A": "Encontrar defeitos",
        "B": "Provar que o software não tem erros",
        "C": "Documentar o código",
        "D": "Acelerar o desenvolvimento",
        "E": "Reduzir custos de infraestrutura"
      },
      "correta": "A",
      "erradas": ["B", "C", "D", "E"],
      "tipo": "Radio button",
      "imagem": "",
      "level": "K1"
    },
}
```
---

## Autor

Simulado CTFL para estudos da certificação Foundation Level v4.0
