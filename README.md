# ScriptGen – AI YouTube Script Generator

A professional web application for YouTube creators to generate scripts with AI-powered generation, SEO optimization, chapters, B-roll suggestions, and shorts extraction. Supports English, Tamil, Thanglish, and Hindi.

![ScriptGen](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

### 🎬 Multi-Stage Script Generation
- **4 separate API calls** ensure complete, comprehensive scripts
- **Stage 1**: Hook & Intro - Grab attention from the first second
- **Stage 2**: Main Content - Detailed explanations with code examples
- **Stage 3**: Demo & Outro - Practical demonstrations and call-to-actions
- **Stage 4**: Production Notes - B-roll, graphics, and editing guidelines
- Live progress updates show generation status

### 💻 Line-by-Line Code Explanations
When "Include code examples" is enabled:
- Complete working code shown first
- Every single line explained separately
- Thanglish format: `"Inga paaru, [explanation]"`
- Expected output and common errors included

### 🗣️ Multi-Language Support
- **English, Tamil, Thanglish, Hindi**
- Thanglish = Tamil + English mix
- Adjustable Thanglish ratio: **50-90% Tamil** (default 70%)
- Natural phrases and regional context support
- Instant translation between languages

### ⏱️ Timestamp-Based Structure
Precise timestamps calculated based on video duration (5-20 minutes):
- Hook: 4% of total time
- Intro: 8% of total time
- Main Content: 58% of total time
- Demo: 18% of total time
- Outro: 12% of total time

### 🔍 SEO Optimization
- 5 alternative video titles
- 200-300 word description with keywords
- 15+ relevant tags
- 3 thumbnail text suggestions
- First comment template for engagement

### 🎥 Production Notes
- B-roll shots needed (5-7 items)
- Graphics/animations requirements
- Code display guidelines
- Screen recording notes
- Background music intensity suggestions
- Text overlays and editing notes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4.1

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd script-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Video Title** (required) - The topic of your video
2. **Set Channel Name** (optional) - For personalized introductions
3. **Adjust Duration** - Slide to select 5-20 minutes
4. **Select Content Type** - Tutorial, Story, Review, etc.
5. **Choose Tone** - Casual, Professional, Humorous, etc.
6. **Configure Advanced Options**:
   - Difficulty Level (Beginner/Intermediate/Advanced)
   - Thanglish Ratio (50-90% Tamil)
   - Include Code Examples (checkbox)
   - Add Tamil Nadu Context (checkbox)
7. **Click Generate Script**
8. **View Results** - Switch between Script and SEO Data tabs
9. **Copy or Download** - Save your script for use

## Project Structure

```
script-generator/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page entry point
│   └── ScriptGenerator.tsx  # Main component with all functionality
├── public/                  # Static assets
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## API Configuration

The application uses the OpenAI API with the following settings:

- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-4.1`
- **Max Tokens**: 2500 per stage
- **Headers**: Content-Type, Authorization (Bearer token)

## Design Philosophy

- **Professional, developer-grade design** - No flashy AI-generated aesthetics
- **Clean and minimal** - Slate grays with blue accents
- **Functional first** - Easy to use, responsive layout
- **Two-column layout** - Configuration on left, output on right

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects.

---

Built with ❤️ for YouTube Creators worldwide
