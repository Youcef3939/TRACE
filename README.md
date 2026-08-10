# TRACE

**Think. Research. Assess. Check. Explain.**

> In a world where anyone can generate convincing information in seconds, the most valuable skill isn't knowing what to believe, it's knowing how to find out for yourself

TRACE is an AI-powered Media & Information Literacy (MIL) platform built for the **UNESCO Youth Hackathon 2026** ("Play Your Part: Youth Designing the Future of Media and Information Literacy")

Submit a claim, post, article, screenshot, or URL, and TRACE doesn't just hand you a verdict, it investigates the content in front of you: extracting the claim, tracing it to its source, gathering evidence for and against it, checking context, and explaining its reasoning in plain language. Then it shows you how to do the same investigation yourself next time

**TRACE does not simply tell you whether something is true or false. It teaches you how to determine that yourself.**

---

## Why TRACE

Most fact-checking tools work like this:

```
Content → AI verdict → TRUE / FALSE
```

You get an answer, not understanding,and no way to reproduce the process next time

TRACE works like this instead:

```
Content → Claim extraction → Source tracing → Evidence → Context → Assessment → Explanation → User learning
```

The gap TRACE is built for isn't "people can't find information" 
it's that **people are increasingly expected to evaluate information on their own, with little practical support for learning how.** That's a Media & Information Literacy problem, and TRACE is designed as an MIL tool first, an AI tool second


---

## How It Works

1. **Trace the Claim** — extract the actual checkable claim(s) from the submitted content
2. **Trace the Source** — find where the claim originated and examine the source's credibility
3. **Trace the Evidence** — retrieve supporting and contradicting evidence
4. **Assess** — weigh evidence quality, recency, context, and manipulation signals
5. **Explain** — surface the full reasoning chain instead of a black-box score
6. **Teach** — show the user how they could verify similar claims independently

### Example

**Claim:** "Coffee has been proven to prevent cancer."

**TRACE finds:** studies discussing associations between coffee and certain health outcomes — none supporting the absolute claim made in the post.

**Signals:** ⚠️ absolute language · ⚠️ no cited source · ⚠️ oversimplified science

**Assessment:** Questionable / Misleading — with the reasoning chain and verification steps shown, not just the label.

---

## MVP Scope

- [ ] Claim extraction
- [ ] Source tracing
- [ ] Web evidence retrieval
- [ ] Evidence comparison (supporting vs. contradicting)
- [ ] Source & context analysis
- [ ] Explainable, reasoning-chain assessment
- [ ] Multilingual interface (English, French, Arabic)
- [ ] "Learn how to verify" guidance
- [ ] Investigation history

**Input types:** URL, pasted text, screenshot/image, social media post

**Out of scope for the hackathon prototype:** browser extension, mobile app, gamified challenges, classroom dashboard, public API — see [long-term vision](#long-term-vision).

---

## Architecture

| Layer | Approach |
|---|---|
| Frontend | Next.js / React |
| Backend | Node.js / API routes |
| AI layer | LLM for claim extraction, reasoning, explanation, multilingual interaction |
| Retrieval layer | Hybrid search (keyword + semantic) with source ranking |
| Evidence layer | Structured store for claims, sources, evidence, timestamps, and relationships |

**Core principle: retrieval-grounded, not free-generation.** Every assessment TRACE makes must be tied to evidence that was actually retrieved and can be inspected — the model isn't allowed to just assert an answer from its own internal knowledge.

---

## Why This Matters (MIL Alignment)

| MIL Skill | How TRACE Builds It |
|---|---|
| Finding information | Source & evidence retrieval |
| Evaluating sources | Source credibility assessment |
| Understanding context | Context analysis |
| Detecting manipulation | Manipulation indicators |
| Comparing information | Supporting vs. contradicting evidence |
| Critical thinking | Guided user investigation |
| Independent verification | "Learn how to verify" step |
| Digital citizenship | Responsible information consumption |

---

## Responsible AI

TRACE can be wrong, and it's designed to say so rather than hide it:

- Every assessment cites its actual evidence
- Uncertainty is stated explicitly, never smoothed over
- Multiple sources are compared, not just one
- Evidence and inference are kept visibly distinct
- An honest "insufficient evidence" state exists and is used when warranted

**TRACE should help users question information — including TRACE itself.**

---

## Long-Term Vision

Beyond the hackathon prototype:

- **TRACE Web** — the main investigation platform
- **TRACE Browser Extension** — investigate content in-place
- **TRACE Mobile** — investigate posts and messages where people receive them
- **TRACE Learn** — interactive media-literacy courses
- **TRACE Challenge** — gamified misinformation-detection practice
- **TRACE Classroom** — tools for teachers
- **TRACE API** — integration for educational platforms and organizations

---

## Team

Built by a two-person youth team from Tunisia for the UNESCO Youth Hackathon 2026

Youcef chalbi - computer engineering student
hamdi Belhadj - cloud engineering student

---

## License

MIT