# Domain Contract Reference (Sprint 9 Freeze)

Canonical frontend domain specification prior to authoritative backend integration.

## 1. Entities

| Entity | Primary ID | Purpose | Key Fields |
|---|---|---|---|
| **Assessment** | `ID` (string) | Assessment definition, block stack, and configuration constraints. | `id`, `slug`, `title`, `description`, `mode`, `presentationMode`, `status`, `timeLimitEnabled`, `activityTimeLimitSeconds`, `leaderboardEnabled`, `blocks`, `settings`, `createdAt`, `updatedAt` |
| **Question / Block** | `ID` (string) | Discriminated union of stackable assessment units. | `id`, `type`, `title`, `description`, `required`, `order`, `points` + subtype specific fields (`options`, `scaleMin/Max`, `placeholder`, `mediaUrl`) |
| **Choice** | `ID` (string) | Individual option inside single/multiple choice questions. | `id`, `label`, `value`, `isCorrect`, `color` |
| **Participant** | `ID` (string) | Distinct participant identity separate from attempts. | `id`, `displayName`, `email`, `avatarSeed` |
| **Attempt** | `ID` (string) | Durable record of a candidate attempt on an assessment. | `id`, `assessmentId`, `participantId`, `participantName`, `status`, `answers`, `score`, `maxScore`, `percentage`, `startedAt`, `completedAt`, `expiresAt`, `totalDurationMs`, `totalTimeSeconds` |
| **Answer** | `ID` (string) | Per-question response record within an attempt. | `id`, `attemptId`, `questionId`, `value`, `scoreAwarded`, `answeredAt`, `responseDurationMs`, `isCorrect` |
| **LiveSession** | `ID` (string) | Host lobby coordination and projection state. | `id`, `assessmentId`, `status`, `participantUrl`, `participants`, `startedAt`, `endedAt` |
| **LiveParticipant** | `ID` (string) | Real-time participant attendee presence record. | `id`, `participantId`, `displayName`, `status`, `joinedAt`, `attemptId` |
| **LeaderboardEntry** | `participantId` | Ranked leaderboard result entry. | `participantId`, `displayName`, `rank`, `score`, `totalDurationMs`, `completedAt` |
| **AssessmentStats** | `assessmentId` | Aggregated analytics read model. | `assessmentId`, `participantCount`, `completedCount`, `averageScore`, `passingRate`, `attempts` |

## 2. Enums & Unions

```ts
type ID = string;
type ISODateTime = string;

type AssessmentMode =
  | "quiz"
  | "pretest"
  | "posttest"
  | "task"
  | "survey"
  | "form";

type PresentationMode =
  | "formal"
  | "playful"
  | "custom";

type AssessmentStatus =
  | "draft"
  | "active"
  | "archived";

type BlockType =
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "scale"
  | "header"
  | "section"
  | "image"
  | "timer"
  | "choice"       // normalized alias
  | "checkbox"     // normalized alias
  | "title_description";

type AttemptStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

type AnswerValue =
  | string
  | string[]
  | number
  | null;

type LiveSessionStatus =
  | "lobby"
  | "live"
  | "completed";

type LiveParticipantStatus =
  | "joined"
  | "active"
  | "completed"
  | "disconnected";

type ChoiceColor =
  | "coral"
  | "sky"
  | "gold"
  | "mint";
```

## 3. Key Invariants

1. **Deterministic Scoring**:
   - Total attempt score is strictly derived from per-question scoring (`deriveTotalScore`), never by increment-only accumulation.
   - Backward and forward navigation replaces an existing question's awarded score without duplicating points.
2. **Timer Semantics**:
   - `activityTimeLimitSeconds` on `Assessment` represents the continuous activity constraint across the entire attempt.
   - Per-question timer countdowns are not permitted as constraint rules.
   - `responseDurationMs` on `Answer` is analytics telemetry.
   - `expiresAt` on `Attempt` is fixed at attempt start (`startedAt + activityTimeLimitSeconds * 1000`).
3. **Leaderboard Authority & Visibility**:
   - `leaderboardEnabled` toggles public podium/ranking access.
   - `scoreVisible` and `rankVisible` control participant score disclosures independently.
   - Future backend is the authoritative engine for leaderboard ranking order; frontend sorting operates via deterministic comparator (`score DESC`, `duration ASC`).
4. **Storage & Contract Safety**:
   - Persisted contracts contain JSON-serializable primitives only (no `Date`, `Map`, `Set`, or UI components).
   - Storage boundaries are guarded by Zod safe-parsing schemas (`AssessmentSchema`, `AttemptSchema`, `LiveSessionSchema`, `LeaderboardEntrySchema`) with non-crashing fallbacks.

## 4. Ownership & Authority

| Responsibility | Frontend (Current Mock) | Backend (Future Target) |
|---|---|---|
| **Assessment Schema & Settings** | Local repository / session | Authoritative persistent storage |
| **Scoring Evaluation** | Local deterministic client evaluation | Authoritative server evaluation |
| **Attempt Lifecycle & Timers** | Client sessionStorage / interval | Authoritative server timestamp & expiry |
| **Live Lobby Presence** | Mock storage state | WebSocket / SSE real-time sync |
| **Leaderboard Calculation** | Local sorted array | Authoritative ranking query & caching |

