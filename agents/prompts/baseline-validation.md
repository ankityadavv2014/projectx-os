# PROJECTX BASELINE VALIDATION RULE (NON-NEGOTIABLE)

## Agent System Prompt Addendum

**Add this to the TOP of every agent prompt.**

---

Before designing, coding, or proposing any feature, UI, API, or workflow, you MUST:

## 1️⃣ Identify the ProjectX Layer

Which phase does this feature belong to?

| Phase | Verb | Purpose |
|-------|------|---------|
| **Project eXperience** | LEARN | Experience the future today |
| **Project eXperiment** | WORK | Experiment, collaborate, simulate |
| **Project eXcel** | EARN | Turn capability into value |
| **Project eXpand** | INVENT | Multiply impact globally |

## 2️⃣ Identify the Primary Persona

Who is this for?

- [ ] Learner (Student)
- [ ] Teacher
- [ ] Parent
- [ ] Facilitator
- [ ] School Admin
- [ ] Partner / Employer

## 3️⃣ Validate Against Baseline Expectations

### Project eXperience (LEARN)
- ✅ Must be safe, simple, inspiring
- ✅ No heavy admin burden
- ✅ OS-like exploratory feel
- ✅ Focus on experience, not outcomes
- ❌ No irreversible actions

### Project eXperiment (WORK)
- ✅ Sandbox-first
- ✅ Failure allowed
- ✅ Collaboration encouraged
- ✅ Clear separation from production data
- ✅ Experiment expiration rules

### Project eXcel (EARN)
- ✅ Auditable
- ✅ Verified
- ✅ Reputation-aware
- ✅ Secure by default
- ✅ Clear ownership and permissions

### Project eXpand (INVENT)
- ✅ Modular
- ✅ Federated
- ✅ Region-aware
- ✅ Standards-driven
- ✅ Partner-friendly

## 4️⃣ Handle Violations

If your proposal violates the baseline of its layer:

1. **You MUST revise it**, OR
2. **Explicitly explain why deviation is necessary**

Document the trade-off and get explicit approval.

## 5️⃣ Required Output Section

**Every feature proposal MUST include:**

```markdown
## Baseline Compliance Check

- **Layer:** [eXperience | eXperiment | eXcel | eXpand]
- **Persona:** [Learner | Teacher | Parent | Facilitator | Admin | Partner]
- **Compliance Status:** [✅ Compliant | ⚠️ Exception | ❌ Violation]
- **Risks if Violated:** [List risks]
```

---

## Example Usage

### Feature: "Add direct payment for missions"

```markdown
## Baseline Compliance Check

- **Layer:** eXcel (EARN)
- **Persona:** Learner
- **Compliance Status:** ✅ Compliant
- **Risks if Violated:** 
  - Mixing learning with transactions creates confusion
  - eXperience users would see monetization too early
  - Trust score system not yet implemented
```

### Feature: "Allow students to delete their submissions"

```markdown
## Baseline Compliance Check

- **Layer:** eXperience (LEARN)
- **Persona:** Learner
- **Compliance Status:** ⚠️ Exception Required
- **Risks if Violated:**
  - Irreversible actions in LEARN phase
  - Audit trail broken
  - Portfolio integrity compromised

**Exception Justification:** 
Soft-delete with 7-day recovery window. 
Teacher notification on delete request.
```

---

## Validation Questions Checklist

Before implementing, ask:

### For eXperience features:
- [ ] Is this delightful and simple?
- [ ] Can a 10-year-old use it?
- [ ] Is there any irreversible action?
- [ ] Does it require backend complexity?

### For eXperiment features:
- [ ] Is this sandboxed?
- [ ] Can experiments contaminate production?
- [ ] Is there an expiration policy?
- [ ] Is failure gracefully handled?

### For eXcel features:
- [ ] Is every action auditable?
- [ ] Are permissions clearly enforced?
- [ ] Is verification required?
- [ ] Is reputation considered?

### For eXpand features:
- [ ] Is this modular/pluggable?
- [ ] Can partners customize?
- [ ] Is data residency respected?
- [ ] Does it follow federation protocol?

---

## No Valid Output Without This Check

**Any code, design, or proposal that does not include a Baseline Compliance Check is considered INCOMPLETE and must be revised.**

---

*This is the ProjectX quality gate.*
