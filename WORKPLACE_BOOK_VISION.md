# OMESG360 Darbo vietos knyga / Workplace Book Vision

Status: VISION CAPTURED / NOT IN ACTIVE DEVELOPMENT
Date: 2026-08-24
Branch: `main`

## Purpose

Capture the product direction of the unfinished Darbo vietos knyga (DVK) concept before any new implementation work begins.

This is not a technical specification and does not start development.

## Product role inside OMESG360

Darbo vietos knyga is envisioned as the shop-floor / operator-facing layer of the OMESG360 operational system.

Its purpose is to give a person at a specific workplace one practical place for the information needed to perform the work safely, consistently and according to the current agreed standard.

It should not become a generic Lean encyclopedia or a document dump.

## Core user question

> What do I need to know and do correctly at this workplace, now?

Typical content may include:
- workplace / zone / role context;
- current standard work / SOP;
- work sequence and key steps;
- `Ką? / Kaip? / Kodėl?` logic;
- quality-critical points;
- safety / EHS points;
- cycle / takt information where relevant;
- setup / SMED guidance;
- common faults / abnormal conditions and response guidance;
- TWI-style training content;
- local Kaizen / improvement information;
- current standard version and revision status.

## SOP and standardization

SOP is one artifact of standardization, not a permanent truth and not the whole product.

The current standard should represent the best presently agreed way of working and remain improvable as the process changes and new learning appears.

Conceptual loop:

`Process -> Standard -> Work -> Learning -> Improvement -> Revised standard`

A changed critical standard may trigger training or competence review in connected capability tools.

## Relationship to Competency Matrix

Darbo vietos knyga and Competency Matrix should not become two isolated systems duplicating the same process knowledge.

Conceptually:

- **Darbo vietos knyga** answers: `How do we work here?`
- **Competency Matrix / Capability** answers: `Who can perform this work, at what level, and where are the gaps?`

They should eventually share the same underlying process / standard knowledge where appropriate.

The same approved standard may support:
- operator workplace guidance;
- Team Lead competence evaluation;
- training needs;
- Globėjas / trainer work;
- reassessment / requalification after meaningful changes.

## Relationship to Lean tools

Lean methods should appear in DVK only when they are relevant to the actual workplace and task.

Examples:
- Standard Work;
- TWI;
- 5S / 6S workplace standards;
- SMED;
- visual quality controls;
- safety controls;
- Kaizen / PDCA outputs;
- relevant problem / abnormal-condition guidance.

Advanced Lean Six Sigma theory such as ANOVA, DOE or regression does not belong in the operator view merely because it exists in the wider OMESG360 knowledge base.

The principle is contextual relevance, not completeness.

## Knowledge and system resilience

A strong process must not depend on one `superhero` who holds the critical knowledge only in their head.

DVK should help turn practical expert knowledge into organizational knowledge without diminishing the value of the expert.

The intended shift is from:

> Ask one specific person. They know.

Toward:

> The current work knowledge is captured, maintained and available at the workplace, while experienced people help improve it and develop others.

## Operator and Team Lead views

The original DVK concept already suggested different needs for different users.

Future direction may retain this distinction:
- **Operator view:** concise, contextual, current workplace guidance;
- **Team Lead / supervisor view:** maintain standards, review content, connect training / capability / improvement actions.

Exact permissions and application architecture are deliberately deferred.

## OMESG360 system relationship

Long-term conceptual relationship:

`Process / Flow`

-> `Stability`

-> `Standardization (SOP / Standard Work / TWI / DVK)`

-> `People Capability (Competency Matrix / training / Globėjai)`

-> `Improvement (Kaizen / PDCA / problem solving)`

-> back to improved process and standard.

Darbo vietos knyga may become the operator-facing window into this larger loop, rather than a standalone disconnected product.

## Current decision

KEEP / MERGE INTO FUTURE OMESG360 CORE.

VISION CAPTURED.

Do not start a rebuild, application architecture, shared data model, AI integration, security design or UI implementation from this document alone.

Reopen when the OMESG360 operational toolset is explicitly reprioritized.
