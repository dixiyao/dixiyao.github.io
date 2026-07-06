+++
author = "Dixi Yao"
title = "How to Pick a PhD Advisor, According to 12,344 Reviews (Plus an Interactive Helper)"
date = "2026-07-06"
+++

When I wrote about [preparing your CS PhD application](#post:csphdapp), one piece of advice was easy to give and hard to execute: *choose your advisor carefully*. Everyone says it. Nobody tells you how. Anonymous review platforms exist, but can you actually trust a 2.7-star rating attached to a stranger's worst semester?

I decided to find out with data. I analyzed **11,311 advisor profiles across 490 universities and 12,344 bilingual (Chinese/English) reviews** from the OpenAdvisor platform, matched them against CSRankings faculty metadata and professional metrics (h-index, citations, career stage), and distilled the results into a practical tool.

🧭 **Interactive Advisor Helper:** [dixiyao.github.io/csmladvisor](https://dixiyao.github.io/csmladvisor/)
📄 **Full paper (PDF):** [Portraits of Graduate Advising: Advisor Rating Correlates and an Evidence-Based Rubric for PhD Applicants](assests/papers/portraits-of-graduate-advising.pdf)
💻 **Code & data pipeline:** [github.com/dixiyao/CS-ML-Advisor-Helper](https://github.com/dixiyao/CS-ML-Advisor-Helper)

## Ratings are bimodal — the average is almost meaningless

The single most useful fact about advisor-review platforms: nobody bothers to write "my advisor is fine." **32.7% of profiles sit at 1 star and 20.8% at 5 stars** (mean 2.74). People show up to warn or to celebrate, so the distribution is U-shaped and the numeric average tells you very little. A 3.0 usually doesn't mean "mediocre advisor" — it means mixed extreme experiences. Read the text, not the number.

<img src="paper_figs/advisor_rating_distributions.png" alt="Bimodal distribution of advisor ratings: mass concentrated at 1 and 5 stars" data-full-image="paper_figs/advisor_rating_distributions.png" data-image-title="Advisor ratings are strongly bimodal" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 20px 0; cursor: pointer;">

## Fame is not mentorship

For the subset of profiles I could match to professional metrics, I tested whether h-index, citation count, or career stage predict how students rate their advisor. The answer: **R² ≈ 0.000**. Essentially none of the rating variance is explained by the professional factors applicants obsess over. This echoes what I found in [Do Tweets Beat Peer Review?](#post:tweets_vs_peer_review) — the metrics that build careers and the qualities that make good mentors are largely decoupled. A superstar CV tells you the lab has resources and visibility; it tells you nothing about whether you'll get a meeting next week.

## What students actually complain about

Review text concentrates in recurring *behavioral* themes. From these I built a 10-dimension, behavior-only selection rubric (no demographic factors, by design):

| Dimension | Weight | | Dimension | Weight |
|---|---|---|---|---|
| Meeting Availability | 0.20 | | Research Direction | 0.10 |
| Respect & Communication | 0.18 | | Lab Culture | 0.07 |
| Funding Support | 0.15 | | Graduation Timeline | 0.05 |
| Work Pressure | 0.12 | | Authorship Credit | 0.02 |
| Career Development | 0.10 | | Immigration/Visa | 0.01 |

<img src="paper_figs/advisor_rubric_dimensions.png" alt="Rubric dimension weights, led by meeting availability and respect and communication" data-full-image="paper_figs/advisor_rubric_dimensions.png" data-image-title="The 10-dimension behavior-only rubric" style="width: 85%; max-width: 100%; height: auto; display: block; margin: 20px auto; cursor: pointer;">

The two heaviest dimensions are mundane: does the advisor *meet with students*, and do they *treat students with respect*. Not research taste, not venue prestige — availability and decency.

One methodological warning for anyone mining review platforms: keyword-based theme detection **over-identified themes by ~35×** on Chinese text compared to LLM (DeepSeek) classification, because common academic vocabulary triggers false matches. Weights above are qualitative starting points, not precise measurements. Western name-based demographic inference also collapses on this data (1.4% classifiable), so a proper bias audit wasn't even possible — a data-infrastructure gap in itself.

## The interactive helper: questionnaire in, LLM prompt out

The rubric only helps if you use it, so the [project page](https://dixiyao.github.io/csmladvisor/) turns it into an interactive tool. You answer twelve short questions about an advisor you're considering — multiple choice (a/b/c/d) for things like communication style and authorship norms, numbers for things like meetings per month and average time to degree, plus the advisor's platform rating if one exists. "I don't know yet" is always a valid answer.

The tool then gives you three things: a **weighted preliminary score** with red flags called out, a **ranked checklist of what you still need to find out** (unknowns sorted by rubric weight — these become your questions for current students), and — deliberately the final step — a **structured prompt** embedding your answers and the research context. Copy it into Claude, ChatGPT, DeepSeek, or whatever you use, and the LLM does the deeper analysis: how serious each red flag is, what benign explanations exist, what to verify, and whether to lean toward or away from this advisor. The tool stops at the prompt on purpose. A static questionnaire shouldn't pretend to render a verdict on a human being; it should structure your evidence and hand you off to a reasoning system — and ultimately to real conversations with real students.

Everything runs in your browser; nothing you type is sent anywhere.

## The honest caveats

Reviews are subjective, self-selected reports — never ground truth about a person. The platform skews heavily toward Chinese universities (98.5% of profiles), professional-metric linkage covers only 1.5% of profiles, and contested profiles (where advisors got reviews hidden) actually rate *higher* on average, hinting at adversarial dynamics. The rubric is a tool for **investigation, not ranking**: use it to decide which questions to ask, then go ask them.

---

**Tool:** [dixiyao.github.io/csmladvisor](https://dixiyao.github.io/csmladvisor/) · **Paper:** [PDF](assests/papers/portraits-of-graduate-advising.pdf) · **Code:** [CS-ML-Advisor-Helper](https://github.com/dixiyao/CS-ML-Advisor-Helper)

*Like the tweets paper, this study was produced with my agent-based research workflow — see ["My Research Workflow with Agents"](#post:research_assistant). All numbers were verified against the analysis pipeline in the repo; ethics protocol and limitations are in the paper's appendix.*
