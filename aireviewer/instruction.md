***
Overall instruction: 
    Your task is to create a webpage indexed by dixiyao.github.io/aireviewer. The style should be professional and academia. This is a webpage as the course work of the following course: https://minalee-research.github.io/teaching/writing-with-ai.html

    The detailed deliverable requirement we must meet is course_requirement.xt

    I will then list out the content, and you use the content I gave including images in folder aireviewer/assests/ to build the webpage
***
{
    "title": Debate and Rebuttal: Multi-Agent Reviewer for Pre-Submission Manuscript Polishing,

    After title place a module here with the code link: https://github.com/dixiyao/LLM-Academic-Writing/tree/main/AIReviewer
    demo video:"https://www.youtube.com/watch?v=-wzwkXZaeKI"
    poster: place holder link

    "Abstract": Exsiting agent-based AI reviewer focus on providing reviews which can directly be copied and pasted while neglect that the true necessatiy is helping authors poslish and produce better research papers or projects. In this project, we focus on building an interactino review system where we use multi-agents to generate a helpful reviews and let users can interact and rebutal back for multi-rounds so as to get the best suggestion for improveing the manuscript. With case studies and experiment results, we can see our system can give more fair judgements and solid suggestions.",
    "Introduction":
    """
    With the emergence of LLM anf agentic systems, several agent-based paper review tools have recently emerged, such as AgenticReviewer\footnote{\url{https://paperreview.ai/}} and multi-agent review systems~\citep{d2024marg,bolanos2024artificial,couto2024relevai}. Given a academic paper, they can generate human-like review within the guideline review template. However, standing on the necessaty of having AI reviewer, the importance is better help we authors to produce better research papers, concrete work, and rigorous experiments for evidence. 
    
    Standing on the point of a reviewer, a lot existing conferences such as ICML, OSDI, etc. has explicit policy that reviewers may use AI for assistant but cannot use fully AI-generated review. The ICML (https://blog.icml.cc/2026/03/18/on-violations-of-llm-review-policies/) also inject some artifacts into the pdf to detect whether reviewer directly copy and past AI reviews. Submitting fully LLM-generated reviews violates academic integrity policies; such reviews risk being removed, and papers authored by those reviewers may face desk rejection.
    
     On the view of an author, simply using an AI reviewer to get a review does not have too much meaning while the thing matters is that how thoese reviews and polish the paper, or for a straighforward concern, getting the paper accepted. NeurIPS also provides each paper a voucher to use LLM reviewer helping imporve the paper (https://blog.neurips.cc/2026/04/21/neurips-supports-authors-with-googles-paper-assistant-tool-pat/).These evidence point to the point that he purpose of an AI reviewer should \emph{not} be to produce ready-made reviews for conferences. The real purpose should be to help \emph{authors} improve their manuscripts before submission. 
     
     Due to  the false poistion existing tools placed, they focus on tyring to optimize for alignment with human reviews in soundness, tone, and score distribution, yet human reviews themselves do not always follow guidelines or correctly analyze a paper. As a result, this project reframes the objective from the author's perspective with two goals: (1)~identify potential flaws that reviewers are likely to criticize and provide actionable improvement suggestions, and (2)~maximize the likelihood of receiving higher review scores.

     To meet the objective, we have two main features (1) We adopt multiple agents acting with different characters including experiment reviewer, method reviewer, harsh reviewer, normal reviewer, related work searcher, and area chair. They debate with each other following multi agent debate~\cite{liang2024encouraging}. The agent will provide both reviews and suggestions to the paper where each suggestion will be marked with corresponding sentences in the manuscript. (2) To impose interaction and authors improve the paper, we provide an interface that user can rebuttal or response to general reviews or each reviewer to further ask question, rebuttal unreasonable weankness to get the better reviews.

     In this project, we select several papers from top venues in the area of machine learning as an example and use cases to show that how different our system react from existing tools and provide insights they why our system provide better reviews and can help improve polishing the presubmission manuscript.
    """,
    "Design Logics":
    \subsection{System Design}
    This figure (workflow.png) shows the whole pipeline of our design logic. With a user given PDF, we need to configure the review guideline. The reviewer guideline will be an important reference for generating reviews as system level. We will detail how each component of our system is constructed

    Multi-agent Debates:
        One important part and contribution of this project is we use a multi agent systems with the multi-rounds of debate between different agents. We first let each reviewer with speicifc character to review the papers. We have following characters 
            Characters:
                Summary Reivewer: This reviewer simply just summarize what the paper does and the main contribution.
                Method and Experiment Reviewer: It first reads the reivewer guideline on instruction which is related to the method and experiment then only focus on checking whether the method makese sense and whether experimentsd are rigorous.
                Related Work and Novelty Reviewer: This reivewer check to make sure no other people have done similar work before. This reviewer will also search on the internet for related work if the search engine option is one.
                Writing and Claim-Evidence Reivewer:The reviewer check each claim has solid evidence in the paper. Checking some minor writing issues as well. This reviewer also check for impact and ethinical concenrs.
                Standard Reviwer: We ask this reviewer to strictly follow the review guideline to review the paper
                Harsh Reviewer: This reviewer is designed to be very critical. The reviewer is prompted with a hypothesis that it wants to reject this paper. Then, it produces the review.
                Area Chair: Take all reviews together and give final comments and suggestions.
        In each round, we first let each reviewer except area chair generate reviews and then let them discuss with each other for a debate then. All the debates results and reviews are then input into the area chair for final rounds of answers, and giving the suggestions.

        As we learn from the discussion and topics in week 3 about what process we want AI. One critical difference is that this project let our agent have the ability to monitor the process than simply review or generate. The area chair will guide each reviewer what to do and revise and then input these to other reviewers by multi-round of interaction. The monitor process in this project is a place to make it different from others.
        
    Prompts:
        In this part, we describe the high-level idea about how we curate the prompts while the full prompts can be referred from our code base.
        Syste prompt: For system prompt, we use the similar way of construction where we include the review guideline, and for each reviewer, we use different prompt to best describe their jobs. We ask the reviewer to focus on giving suggestions rather than similar listing a bunch of weakness. We further ask the reviewer to verify the wekaness to make sure they are actionable and solid. We explicit exclude some common but random weakness like simply asking adding more experiments without reasons or justification, simply asking to scale up the experiments and usinng bigger models without justificatio etc.

        In context learning:  apart from the prompt, we also design a logic of in-context learning where users can provide some review examples to further guide the reviewers about what are good quality review. 

    Reply and Rebuttal.
        Another important feature is we explore new ways to interact with AI in forms of AI review. We discuss in the lectures on Week 5 about this topics. Here, we show an innovative way to interact. We know that during paper review process there is usually 1 or 2 rounds rebuttal with the reviewers (usually in ML conferences) and authors can resolve question or explain some factual faults made by reviewers. Having the similar idea but we do not limit to only 1 or 2 rounds. Users can freely interact with each reviewer to address questions or ask new questions and improve the paper. We will show details about how we can interact in the next section.

    \subsection{User Interface}
    The user interface is shown as the figure:(ui.png) . In the left side, after user click on the upload PDF, they can select their manuscript. Then the users needs to provide the review guideline. There are two options. User can choose venue name and select predefine venues where we provide NeurIPS 2026, ICML 2026 and ICLR 2026 here. User can also choose their own template which provide self-define review guideline or gudeline copied from other venues. Next, user needs to configure the LLM backends where we provide Gemini and Openrouter. Next, user will select whether the search mode is on. With all these are set, users can use the button run review to generate the first design.

    On the right interaction part, we will first see the review from each different types of reviewer under the tab: Complete review. Here, if user find any review not making sense, users can use the chat box, selecting corresponding reviewer, and send use rebuttal or simplying asking question with the chat button. For specific sentence, user can use mark pdf to highlight sentence, for example, as shown as the (highlight.png), user can select a setence, and the chat will have that sentence as the content for folloiwng content. 

    If user goes to the tab suggestions, the system will list out each detailed suggestion that user can look at. If the user click on one speicifc suggestion, it will jump to the corresponding area in the paper as shown the (suggestion.png). For the context tab, this is used for in context learning, where users can customize or explicit guide AI reviewer on what to focus by providing some review examples. Rebuttal History and sources are easier for user to check the past rebuttal content.

    The complete implementation is at [link](https://github.com/dixiyao/LLM-Academic-Writing/tree/main/AIReviewer).

    "Process and iterations":
    Case Studies and How the system improves:
    In this part, we would like to demonstrate several examples, reivew generated and illustrate how we polish this AI system and show examples that why our AI system works and resolve the things previous work cannot do. The most two features we would like to advertise on is multi-agent systems and rebuttal interaction. Hence, we will use examples to emphaize on the benefits brought by them. In this part of experiment, we follow the workflow and usage of  the system we previously introduced (link to preivous part, call back). We use the Owl Alpha (https://openrouter.ai/openrouter/owl-alpha) as the LLM backend

     One interesting example we use to iterate over and improve our system is the "Attention is all you need"~\cite{vaswani2017attention}, which is a very good paper and have received over 247K citations. In the first version of the reivew, the hard reviewer generate following arguent:
     <text box>
     -The claim that the Transformer is 'the first transduction model relying entirely on self-attention' is not rigorously substantiated against decomposable attention [22] and end-to-end memory networks [28], which also use attention without recurrence.
     - Evaluation is limited to two machine translation tasks. No experiments on other sequence tasks (parsing, summarization, language modeling) are provided, undermining the claim of a general-purpose architecture.
     - The sinusoidal positional encoding extrapolation hypothesis is not empirically validated. Table 3 row (E) only compares sinusoidal vs. learned embeddings on in-distribution data, leaving the core motivation unsubstantiated.
     - Training cost FLOP estimates rely on an unspecified sustained GPU capacity (footnote 5 is missing), making cross-model comparisons difficult to verify. Differences in GPU utilization and implementation efficiency are unaccounted for.
     - Checkpoint averaging (last 5/20 checkpoints) is used but not ablated, making it unclear how much reported gains stem from architecture vs. ensembling effects.
    - No statistical significance testing or variance across runs is reported; all BLEU scores are single-run point estimates, making small differences unreliable.
    - The baseline comparison in Table 2 mixes single models and ensembles without separating them, obscuring architecture vs. ensembling contributions.
    </text box>
    We can see here are several weakness point that are very common to see in several venues by some random reviewers such as no statistical significance, the evaluation is limited and more eperiments on different datasets are needed. Overclai or not rigoroius engineering. The training cost. The hard reviewer will also overestimate these issues which shawdow the contribution of the paper. We can see the standford agentic reviewer also generate ,some similar statements in its reviews:
    <text box>
    - Evaluation is limited to MT; broader applicability is asserted but not substantiated with non-MT tasks (e.g., language modeling, summarization).
    - Comparisons to some contemporaneous or near-contemporaneous attention-only or highly parallel models could be deeper; fairness of compute/hyperparameter tuning across baselines (e.g., ConvS2S, GNMT) is hard to fully verify from presented details.
    - FLOP-based training cost accounting is coarse and relies on sustained TFLOPS assumptions rather than end-to-end wall-clock and efficiency breakdowns (communication vs. compute).
    </text box>
    The standord agentic reviewer has similar features that they use each conference speicifc guidelines. However, one difference of them from us is they do not use multi-agents but simply use one agent to generate comment of different sessions. We can see that it may generate some unfair comments. As a result, in our design desicison, we decide to use multi-agent debate to cirtical think on different parts. Apart from that, we have specific reviewers to only evaluate on experiment, novelty, literature, respectively. We can see the experiment reviewer that experiments are weak accept with several questions that other reviewers can further think on.
    <text box>
    Questions
    What is the standard deviation of BLEU scores across multiple random seeds?
    What is the contribution of checkpoint averaging to the final BLEU scores—can you report single-checkpoint results?
    What sustained FLOP rate per GPU was used in the training cost calculation?
    Were all baseline models in Table 2 evaluated under the same inference settings, or were results taken from original papers with different decoding configurations?
    Can you provide empirical evidence that sinusoidal positional encodings enable extrapolation to longer sequences?
    Recommendation: weak accept
    </text box>
    Different reviewers can input thinking of different aspects and we can see during the multi-round, they have following discussion
    <text box>
    Skeptical Reviewer 2: The Transformer is a novel, fully attention-based architecture achieving state-of-the-art BLEU scores on two translation benchmarks with lower training cost. While impactful, several high-impact weaknesses remain that are difficult to fix in rebuttal, including unsubstantiated novelty claims, narrow evaluation, and unverified extrapolation hypotheses.
    Methodology and Experiments Reviewer: The Transformer introduces a fully attention-based architecture with strong empirical results on two MT tasks. The ablation study is thorough, but evaluation is narrow, statistical reporting is absent, and key reproducibility details (FLOP estimates, checkpoint averaging contribution) are missing or underspecified.
    </text box>
    The multi-agent debate help reviewers to have a more clear image about what they should focus on and eliminate the noise due to once runs.
    The finnaly the area chair can give fair answers:
    <text box>
    The paper's strengths—novel architecture, strong SOTA results, thorough ablation study (Table 3), clear theoretical motivation (Table 1), and detailed training setup—far outweigh its weaknesses for NeurIPS. The weaknesses are addressable through minor revisions (softening claims, adding citations, clarifying methodology) rather than requiring new experiments that would fundamentally change the paper. The hard_reviewer's concerns about 'fatal risks' are overstated: the novelty claim can be precisely scoped against prior work, and the evaluation scope (two major MT benchmarks) is standard for architecture papers at top venues. The paper is clearly above the NeurIPS bar.
    </text box>
    Along with solid suggestions can help improve the paper where we omit here. We will alter use a bordline paper to demonstrate more on the suggestion features of our system. Hence, the review is better, more solid and more fair.

    Since our system can improve reviews of those very good papers. What about papers which may have a lot of faulties? As a result, we select a paper from ICLR 2026, (https://openreview.net/forum?id=USjSdem7WO). The paper is about privacy, feature reconstruction attacks and split learning which falls into my expertise so that we can have a better analysis. Our system generating following reivews
    <text box>
   - Qualify claims in the abstract and introduction to specify 'resistant to evaluated attacks' rather than 'state-of-the-art feature reconstruction attacks' to avoid overstatement.
   - Formally state Hypothesis 1 with clear, testable conditions rather than as an informal question, and explicitly connect Table 1 results (low MSE in activation space but failed reconstruction) to Lemma 3 in the main text discussion.
    </text box>
    This is mentioned by all three reviewers that the hypothesis is not clear and authors do not motivate why MLP is needed and why their specific mentioned attacks needs to study:
    This is copy from one of the reivewers:"
    But again, what is the motivation for using MLP in vision? The reason why contribution 1 stands out in NLP is because it is basically impossible to find similar prior knowledge of data distribution in the real world. But for image, it is common. There is a lot of medical image application and human face identification systems in real-world using split learning. You can easily get public datasets of medical images and human faces. The assumption that attackers have no chance to know prior data distribution does not hold."
    We agree with the human reviewers on the judgement as it may be considered a fundamental issue about the paper requiring solution. Hence, we can see that for the fundamental weakness and issues, our systems can provide concrete judgement.

    Apart from good and bad papers, the most categories most people would care about is their own paper. Because most people and most paper will fall into this category and authors would definitely want to improve the paper to make it each the accetance bar. We would like to use one of our paper FoT as an example.~\cite{yao2026federation}. At the initial versio of review, the system says this paper is not novel comparing to existing multi-agent systems. Then, in the rebuttal, we rebut with the related work reviewer and AC that on eimportant thing we are doing is not putting one big task into subtasks and let each agent take one part but we aggregate from multiple agents of working on different tasks to generate a shared high-level idea library. Then the reviewer suggests an important related work ExpeL~\cite{zhao2024expel} and Hyperagents~\cite{zhang2026hyperagents} and add them into comparison with our methods. We also revise our paper regarding this claim to make the paper more clear. Another example is the paper makes the claim about we can have strong performance on research idea guidance. The reivewer system says it is over-stated. We use the highlight functionality to show each details of the experiment to rebuttal back and the reviewer can give the conclusion that we need cross model validation for LLM-as-a-judge which is a good suggestion. We then add this into the paper to make the evaluation stronger

    Quantative Evaluation: For evaluation, we randomly select 5 papers from ICLR 2026 Oral, 5 from ICLR poster, 10 from ICLR 2026 Rejected. For groudtruth, we mark these four categories and regard them as human evaluation results. Next for our system, we revise the system prompt to ask it give judgement about strong accept, accept, weak accpet, and reject. In this experiment, we use backend with gemini 3.1 pro model. For baselines, the first one is directly asking the gemini 3.1 to quick judgetment with paper provided and following prompt
    <prompt box>
    Please refer to the ICLR 2026 review guideline to have a fair and reasonable judge on the paper.
    </prompt box>
    The other one is the standford agentic reviewer. We acknowledge it may uses a different backend LLM from use so the results can be biased. Here, we are simply comparing at the tool level to see which one is better. We measure cohen kappa for the relevance between each systems.

    <script>
        Please using given data to draw a heatmap of (or use script.py including python code) of cohen kappa.
        Human evaluation [2,2,2,2,2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0]
        Ours [1,1,2,2,2,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0]
        Single Agent [1,1,2,2,2,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0]
        Agentic Reviewer [1,2,1,0,1,0,0,2,0,0,1,0,0,0,0,1,1,0,0,0]

        I prefer create scrip.py , run it get an iamage so later i only need to revise script.py rather than all content
    </script>

    "Conclusion, Reflection and limitations":"In the future, we may want to explore that we could better sturcture the multi-agents. For example, for different conferences, subjects, and tracks, we probably need different chracters and topologies of agents. For example, for benchmark track and industrial track, we may need to focus more on the experiment and data, or engineering. For speciifc subjects, we also need to evaluate the IRB and human subject study and evaluation. As a result, we believe we may need customized design of multi-agent interaction for different types of papers and such design can be autoatically deisgned."
    "Reference":[
            main.bib
    ],
    "AI Disclosure":"We would like to choose visual so it can better present the overall workflow. Because this is a design project with a system then pure lietrearuee content.The judgement of the AI disclosure is <aidisclosure.png>"

    "Acknolwedgement":"This is a course project of graduate course Writing with AI [course website] by Mina Lee [mina]. I would like to thank Mina for helping on this course, providing me with a lot of cutting-edge and elegant ideas, and providing suggestions to this project. I also enjoy the discussion with my classmate providing me with more insights and input me a lot of interesting idea to improve this project as well as multi-agent field I am currently working on.
    
    We did not particularly test the performance of in-context learning but simply put it as a feature. In the future, we can evaluate that.
    
    From quantitive experiment, we can see that one foundamental question that AI reviewer tends to make paper closing to borderline still eixts. This is due to the post training RLHF of existing all LLMs and all AI reviewers have this issues. In the future, we expect there will be solution to resolve that. 
    ".
    "Ethinical Claim": "We sample papers from case studies without targetting at any paper or any author, espcially for samples as bad papers and borderline papers."
}

Note:
1. For reference, please convert to standard academia reference formatting like CHI/NeurIPS/ICML formatting etc.
2. For some links, please use like github or icon like module to embed links or urls
3. For place i notate with <text box> </text box>, please use a nice look text box to render it. Text box content is directly copied so you might not change the content in the text box.
4. You should include all things I write here (you can revise the content). The statement highlight to call back and link with the course needs to get some highlight like bold or \emph.