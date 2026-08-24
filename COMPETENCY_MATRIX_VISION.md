# OMESG360 Competency Matrix / Capability Vision

Status: VISION CAPTURED / NOT IN ACTIVE DEVELOPMENT
Date: 2026-08-24
Branch: `main`

## Purpose

Capture the intended product direction before any technical architecture or implementation begins.

This is not a specification and does not start development. It records the core product logic that should survive future design decisions.

## Product role inside OMESG360

The product belongs to the professional OMESG360 toolset.

It is not an HR personality test and not merely a digital spreadsheet. Its purpose is to help Team Leads manage operational knowledge, capability, training needs and resilience as part of the business flow.

The current Excel Competency Matrix is the historical source/prototype. It already contains the core ingredients:
- process;
- process step;
- `Ką? / Kaip? / Kodėl?`;
- current competence (`Faktas`);
- required/target competence (`Tikslas`);
- gap (`Skirtumas`);
- responsibility;
- training planning.

## Core operating loop

`Process -> Current standard / SOP -> Team capability -> Gap -> Trainer / Globėjas -> Training plan -> Reassessment -> Improvement`

The matrix is one view of this system, not the whole product.

## SOP role

SOP is part of standardization, not the final product or a permanent truth.

A standard represents the best currently agreed way of working and must be able to evolve as the process improves.

Future vision:
- Team Lead provides process video, photos or a photo collage;
- AI prepares a draft process description / SOP structure;
- AI may identify actions, key points, quality requirements and safety points where visible/relevant;
- Team Lead reviews, corrects and approves the draft;
- only the approved standard becomes the basis for competence evaluation and training;
- later process learning can trigger SOP revision and competence review.

Security and technical architecture for media/AI processing are deliberately deferred. The product vision must not be constrained prematurely by those implementation choices.

## Competence state

Current scale semantics inherited from the Excel source:
- `N` or `-` = no need for the person/role to know this competence;
- `0` = competence is required but the person does not know/cannot perform it;
- `1-5` = current competence / independence level.

`N / -` is not a score and must never be treated as `0`.

Exact behavioural anchors for levels 1-5 remain to be redesigned before implementation.

## Team Lead workflow

The intended user is primarily a Team Lead / operational supervisor.

The future workflow should allow the Team Lead to:
1. define or approve the current work standard;
2. assess current team competence levels;
3. define competence requirements / targets;
4. see gaps and coverage risks;
5. select Globėjai / trainers responsible for development;
6. plan training against the targets;
7. reassess competence after training;
8. improve the standard and repeat the cycle.

## Capability and flow, not only individual scores

A strong system cannot depend on a single superhero.

Two different questions must remain separate:
- **Individual mastery:** how well one person can perform the work;
- **System resilience:** how dependent the process is on that person.

A process can contain a highly competent person and still be operationally fragile if only one person can perform a critical task.

Future product analysis should therefore consider concepts such as:
- independent coverage;
- backup coverage;
- trainer coverage;
- single-point dependency;
- knowledge concentration;
- critical competence gaps.

The goal is not to reduce the value of experts. The goal is to convert expert knowledge into organizational capability so the system continues to function when one person is absent.

## Bottleneck / flow connection

Competence management should be connected to business flow.

A business bottleneck may be caused by people, equipment, process design, materials or other constraints. This product focuses on the people/knowledge/capability part of that picture.

The useful management question is therefore not only:

> What is the team's average competence level?

but also:

> Where does lack of capability or knowledge concentration create risk or limit the flow?

Training priority should eventually be able to consider operational criticality and system coverage, not only the largest numerical individual gap.

## Improvement loop

The product should support continuous improvement rather than freeze the initial standard.

Conceptual loop:

`Standard -> Training -> Capability -> Operational result -> Learning -> Standard revision -> Capability review`

If a revised SOP changes a critical step, affected competencies may need review or requalification.

## Long-term product layers

1. **Process Stability**
   - identify where the flow is unstable or constrained.

2. **Standardization**
   - define the current agreed work method / SOP and keep it versioned and improvable.

3. **People Capability**
   - know who can perform which work, at what level, and what coverage exists.

4. **Development**
   - convert gaps into trainer assignments, training actions and reassessment.

5. **Flow Risk**
   - identify where capability gaps or knowledge concentration can become operational bottlenecks.

## Current decision

VISION CAPTURED.

Do not start implementation, security architecture, AI provider selection, app/PWA decisions or detailed data modelling from this document alone.

Next development should begin only when this product is explicitly reprioritized.
