...deliberate human judgment is far more effective than relying on a single AI research assistant and the most important thing, doing research for fun! eoihu gere
+++
author = "Dixi Yao"
title = "My Research Workflow with Agents"
date = "2026-05-26"
+++

I want to share how I leverage different AI tools to accelerate my research workflow. There is a lot of exciting work in auto-research and "vibe research," but a strong paper still requires substantial human idea generation, active supervision, and iterative prompting. Current AI-assisted research pipelines feel more like early-stage paper machines than systems for producing fully polished and innovative scientific work. In practice, combining multiple AI tools with deliberate human judgment is far more effective than relying on a single AI research assistant and the most important thing, doing research for fun!

# Documentation and Ideation
This is the most important stage. Research ideas rarely appear from nowhere: they need a foundation.

- Documentation: **[Google Docs](https://docs.google.com)** + **[Overleaf](https://www.overleaf.com)**
- Ideation: Completely human. I shape ideas through conversations with friends, colleagues, peers, advisors, and collaborators. Thank you!
- Related work: **[Google Search](https://www.google.com)** + **[ChatGPT](https://chat.openai.com)** to find resources, then read key papers via Google Scholar.
- New knowledge: **[Gemini](https://gemini.google.com)**, **[ChatGPT](https://chat.openai.com)**, **[Claude](https://www.anthropic.com)** with deep back-and-forth questioning.

# Core
- Theory: Use **[Gemini](https://gemini.google.com)**, **[ChatGPT](https://chat.openai.com)**, and **[Claude](https://www.anthropic.com)** in highest-thinking mode for math verification and theory checks. This is expensive, so I usually do it after initial validations.
- Algorithm / Architecture / System / Design: Completely human. Like ideation, this is the part I enjoy most and keep under my control.

# Implementation
- Coding: Vibe coding with **[Claude Code](https://www.anthropic.com/product/claude)**, **[GitHub Copilot](https://github.com/features/copilot)**, **[OpenAI Codex](https://openai.com/blog/openai-codex)**, and **[OpenRouter](https://openrouter.ai)**, combined with human editing and prompt engineering.
- Deployment: I use **[PhDBot](https://github.com/dixiyao/IOS2SlurmCluster)** to deploy experiments on servers and to monitor success/failure and output quality. Then I use **[GitHub Mobile](https://github.com/mobile)** plus **[GitHub Copilot](https://github.com/features/copilot)** to revise code, review changes, and push updates. After that, I ask **PhDBot** to pull the latest code and rerun experiments. I can also ask PhDBot to edit locally, but that costs tokens.
- Experiment result organization: Custom `skills.md` plus **[Claude Code](https://www.anthropic.com/product/claude)** to format tables and summaries (I will share in another blog).

# Paper
- Writing: I write the first draft manually, the traditional way. Then I use **[Gemini](https://gemini.google.com)**, **[ChatGPT](https://chat.openai.com)**, and **[Claude](https://www.anthropic.com)** — Instant Mode for grammar, Thinking Mode for more elegant writing.
- Figures: I usually draw workflow and overview figures myself, but I sometimes ask **[ChatGPT](https://chat.openai.com)** (e.g., ChatGPT 5.5) for layout ideas. For result plots, I ask **[OpenAI Codex](https://openai.com/blog/openai-codex)** or **[Claude Code](https://www.anthropic.com/product/claude)** to generate `matplotlib` / `seaborn` code.
- Polishing: I use **[AIReviewer](https://github.com/dixiyao/LLM-Academic-Writing)** and other agentic reviewers to get iterative critique. AIReviewer is a tool I developed to interact with AI reviewers, revise drafts gradually, and improve the paper step by step.
- Advertising: After acceptance, I use **Grok** and **[ChatGPT](https://chat.openai.com)** to polish posts for X and LinkedIn, and **DeepSeek** for Zhihu and Rednote.

# Conclusion
AI vibe tools are helpful and make research more enjoyable, but they do not replace the core human work. The most valuable parts remain ideation, acquiring new knowledge, drawing figures, and designing algorithms and systems. My workflow is simple in structure: it is mainly a mix of webpage AIs, agents, **PhDBot**, **GitHub Mobile**, and **AIReviewer**.

# AI Disclosure
Below is a high-level summary of human versus AI participation in this workflow.

<img src="assests/images/aiassistant.png" alt="AI Disclosure Workflow" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 20px 0;">