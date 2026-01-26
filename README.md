# 🎬 The Simpsons API

Aplicação Next.js + TypeScript para explorar personagens, episódios e locações dos Simpsons.

## ✨ Funcionalidades

- 👤 **Personagens**: Visualize todos os personagens com avatares
- 📺 **Episódios**: Navegue por temporadas e episódios
- 🏪 **Produtos/Locações**: Explore produtos e locações icônicas
- ❤️ **Favoritos**: Salve seus favoritos usando localStorage
- 🔍 **Busca**: Pesquise por nome em todas as categorias
- 🎨 **Design**: Interface moderna com tema dos Simpsons

## 🚀 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## 🖼️ Tratamento de Imagens

A aplicação usa a API Sample APIs dos Simpsons. Quando uma imagem falha ao carregar:
- **Personagens**: Avatar gerado automaticamente (DiceBear Bottts)
- **Episódios**: Ícone identicon
- **Produtos**: Ícone shapes

Todas as imagens têm fallback automático!

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **CSS Puro** - Sem frameworks CSS
- **Hooks Customizados** - useFetch & useLocalStorage
- **API REST** - https://api.sampleapis.com/simpsons

## 📁 Estrutura

```
src/
├── app/          # Páginas e layout
├── components/   # Componentes React
├── hooks/        # Hooks customizados
└── types/        # Tipos TypeScript
```

## 🎨 Cores do Tema

- Amarelo Simpsons: #FFD700
- Azul Céu: #0099FF
- Laranja: #FF6B00

---

Feito com 💛 usando a API dos Simpsons
