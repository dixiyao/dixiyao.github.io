+++
author = "Dixi Yao"
title = "Do Tweets Beat Peer Review? How Fame, Hype, and Social Media Drive Citations in ML"
date = "2026-07-04"
+++

We all sense it: a retweet from the right account seems to do more for a paper than months of peer review. But how large is the effect, is it causal, and who benefits? I wrote a paper on exactly this, synthesizing evidence from over 500,000 publications, several large-scale observational studies, a randomized controlled trial, and a meta-analysis of 111 altmetrics studies.

📄 **Full paper (PDF):** [Do Tweets Beat Peer Review? How Fame, Hype, and Social Media Drive Citations in Machine Learning](https://github.com/dixiyao/dixiyao.github.io/blob/master/assests/papers/do-tweets-beat-peer-review.pdf)

This post is the short version — the headline numbers, figures, and what I think they mean for the community.

## The big-name effect is real — and causal

Papers shared by prominent ML curators like [@\_akhaliq](https://x.com/_akhaliq) or [@arankomatsuzaki](https://x.com/arankomatsuzaki) receive **1.7–2.6× more median citations** than matched controls with the same venue, topic, year, and author h-index. The killer detail (Weissburg et al., ICML 2024): *review scores did not differ between groups*. Curators are not just picking better papers — the sharing itself multiplies citations, with a causally identified 9–19% increase in the probability of being highly cited (Negative Outcome Control design).

<img src="paper_figs/tweets_prestige.png" alt="Influencer sharing effect (left) and author prestige vs. paper impact (right)" data-full-image="paper_figs/tweets_prestige.png" data-image-title="Influencer sharing effect (left) and author prestige vs. paper impact (right)" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 20px 0; cursor: pointer;">

The prestige–citation correlation is moderate on average (r ≈ 0.35–0.50), but punctuated by "star" outliers where prestige, timing, and community dynamics conspire to produce runaway impact. Interestingly, *team-level* network centrality predicts citations better than any individual author metric — the Matthew effect operates at the group level.

| Effect | Magnitude | Study | Identification |
|---|---|---|---|
| Influencer sharing boost | 2–3× median citations | Weissburg et al. 2024 | Matching + NOC |
| Network centrality → citations | +2.4–4.8% ΔMSE | Jie et al. 2025 | Prediction model |
| Within-author self-rank | >2× top vs. bottom | ICML 2023 analysis | Self-assessment |
| Matthew effect GEV shape | q ≈ 0.423 | Katchanov et al. 2023 | Bibliometric model |

## Endorsement beats visibility

Across 500K+ publications (Bagchi et al., ICWSM 2025), X/Twitter promotion adds **+44.4 citations** over 5 years in computer science — more than *double* the boost from arXiv submission alone (+21.1). That asymmetry matters: arXiv already reaches everyone in the field, so if the mechanism were mere visibility, arXiv would win. It doesn't. The signal is **endorsement** — a trusted curator vouching for a paper — not exposure. Generic "please read our paper" self-promotion shows no detectable citation effect in randomized trials.

<img src="paper_figs/tweets_promotion.png" alt="Citation boost by channel (left) and social amplification by ML subdomain (right)" data-full-image="paper_figs/tweets_promotion.png" data-image-title="Citation boost by channel (left) and social amplification by ML subdomain (right)" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 20px 0; cursor: pointer;">

| Study | Effect size | Channel | Identification |
|---|---|---|---|
| Weissburg et al. 2024 | 2–3× median citations | Curator endorsement (X) | Matching + NOC |
| Bagchi et al. 2025 | +44.4 citations (5yr) | X promotion (all types) | Stratified, n = 500k+ |
| Bagchi et al. 2025 | +21.1 citations (5yr) | arXiv submission | Stratified, n = 500k+ |

## Peer review rejected the most important papers in ML

Seven of the most impactful papers in ML history — Dropout (~60K citations), Word2Vec (~51K), Adam (~100K), RoBERTa, and others — were **rejected** by top venues, accumulating **340,000+ combined citations** anyway. The rejection rationales are a pattern, not accidents: "too radical" (Dropout), "unscientific" (Word2Vec), "incremental" (RoBERTa), "lacked theoretical justification" (Adam). Reviewers scored theoretical elegance; the community scored downstream utility. When those diverge, peer review filters out exactly the work the community most needs — and arXiv plus social media provided the alternative pathway to impact.

<img src="paper_figs/tweets_rejected_topic.png" alt="Rejected papers that became classics (left) and LLM topic concentration 2019-2024 (right)" data-full-image="paper_figs/tweets_rejected_topic.png" data-image-title="Rejected papers that became classics (left) and LLM topic concentration 2019-2024 (right)" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 20px 0; cursor: pointer;">

The right panel shows the second structural force: LLM papers grew **14×** from 2019 to 2024 (503 → 7,109) at top venues while theory and optimization output stayed flat. An average LLM paper starts with a citation advantage over an average theory paper before either is written.

## Best paper award or celebrity endorsement?

The uncomfortable, evidence-based answer: conditional on writing a good paper, **celebrity endorsement will do far more for your citation count than a best paper award**. Social media wins on speed (hours vs. months), reach (global vs. conference-bounded), signal richness, and predictive power. It loses on exactly one dimension — topic fairness.

<img src="paper_figs/tweets_award_vs_social.png" alt="Social media vs. best paper awards across impact dimensions" data-full-image="paper_figs/tweets_award_vs_social.png" data-image-title="Social media vs. best paper awards across impact dimensions" style="width: 70%; max-width: 100%; height: auto; display: block; margin: 20px auto; cursor: pointer;">

| Dimension | Best Paper Award | Social Media Endorsement |
|---|---|---|
| Timing | Lagging (post-acceptance) | Leading (pre-review) |
| Reach | Conference-bounded | Global, cross-disciplinary |
| Signal type | Binary | Continuous, multi-dimensional |
| Speed of effect | Months | Hours |
| Topic bias | Low (subfield-internal) | High (favors communicable work) |
| Predictive power | Moderate | Strong (2–3× boost) |
| Long-term signal? | Likely (canon formation) | Uncertain (hype decay) |

The two pathways — traditional (prestige → review → acceptance → citations) and emergent (preprint → social amplification → citations) — now operate partially independently, and early advantages in either compound through feedback loops.

<img src="paper_figs/tweets_pathways.png" alt="The traditional and emergent pathways to research impact" data-full-image="paper_figs/tweets_pathways.png" data-image-title="The traditional and emergent pathways to research impact" style="width: 80%; max-width: 100%; height: auto; display: block; margin: 20px auto; cursor: pointer;">

## Not all topics are equal, and the gap is widening

The same endorsement, promotion strategy, and paper quality produce vastly different outcomes depending on topic. "This agent books flights autonomously" fits in a tweet; "a tighter convergence bound for SGD under relaxed smoothness assumptions" does not.

| Topic | Amplification | Audience | Key dynamic |
|---|---|---|---|
| LLMs, Agents, Diffusion, World Models, AI4Science | **High** | Very large | Self-reinforcing feedback loop |
| CV, RL, GNNs, Representation Learning | Moderate | Large | Mixed discovery channels |
| Optimization Theory, PDEs, ML Systems, Statistical Theory | **Low** | Specialized | Structural disadvantage in engagement economy |

If citations drive hiring and funding, and citations are partially decoupled from quality through topic-dependent amplification, the community is systematically underinvesting in foundational work — not because it is less valuable, but because it is less tweetable.

## What should we do about it?

The paper's framing is *displacement without replacement*: social media has partially displaced peer review as the determinant of attention, without being fairer or more accurate — just faster and differently biased. A few concrete recommendations:

- **Hiring committees:** normalize citation metrics within topic-year cohorts. A theory paper with 30 citations may represent a larger relative contribution than an LLM paper with 300.
- **Conference organizers:** build discovery mechanisms (curated reading lists, content-based recommendations) as counterweights to engagement-driven attention.
- **Researchers with large platforms:** your retweets are not neutral sharing — they are allocations of the community's scarce attention, with measurable consequences.
- **PhD programs:** teach research communication as a core competency. The evidence says it matters, whether we like it or not.

The gatekeepers have changed. Gatekeeping itself is not optional — attention is scarce and something must allocate it. The only real choice is whether we design that mechanism deliberately or let engagement algorithms do it for us.

---

**Paper:** [Do Tweets Beat Peer Review? (PDF)](https://github.com/dixiyao/dixiyao.github.io/blob/master/assests/papers/do-tweets-beat-peer-review.pdf)

*This paper was produced with ARIS (Automated Research Investigation System), my agent-based research workflow — see my earlier post ["My Research Workflow with Agents"](#post:research_assistant). All quantitative claims were verified by me against the original sources; a full LLM-usage disclosure is in the paper's appendix.*
