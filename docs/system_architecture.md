# Synapse Complete System Architecture

**Source:** Current local application code. **Scope:** High-level system architecture. **Method:** Static source inspection; no application, tests, builds, AI inference or deployment verification for this export. `implemented` describes connected source code, not demonstrated runtime success. Configuration defaults are distinguished from effective settings, which were not read from private environment files.

Paths below are relative to the workspace root. Backend source is at the root; the application frontend is under `synapse-web/`. The older `frontend/` area is not combined with this application's runtime. No source outside this workspace is needed for the architecture described here. The companion [system_architecture.json](system_architecture.json) includes its own evidence index and uses the same components and connections.

## 1. System Overview

Synapse is an educational accessibility application intended to help blind and low-vision learners engage with online STEM lectures. The local implementation combines an accessible video interface, lecture transcription, representative-frame analysis, structured visual evidence, contextual explanation generation and spoken delivery. It also contains voice commands, personal learning storage, lecture Q&A and separately gated quiz functionality. [S01–S08, S10–S18, S20–S29]

The principal processing path prepares lecture context before generating explanations. It does not send an entire video directly through a single model for every explanation. The backend first detects intervention moments; a persistent preparation manager then runs visual evidence, text and speech stages. User-requested explanations reuse and prioritize this infrastructure. [S13–S16, S21, S24, S26]

## 2. Architecture Summary

The frontend is a React application that can run in a browser or an Electron host. It controls an embedded YouTube player and communicates with FastAPI using JSON HTTP requests, polling, authenticated personal requests and audio delivery endpoints. Video playback streams directly from YouTube, separately from backend media extraction. [S01–S04, S06, S09, S11]

FastAPI owns the application lifecycle, request validation, persistent processing jobs, preparation workers and model warmup coordination. Processing uses internal Python modules, threads and persistent model subprocesses. These responsibilities are **not separate deployed microservices** merely because they appear as distinct diagram nodes. Model inference introduces explicit local-service or remote-endpoint boundaries. [S10, S13–S17, S21–S27]

SQLAlchemy persists shared lecture/job/artifact metadata and owner-scoped learning data. The default database is local SQLite. Larger artifacts and media live on the local filesystem; frontend preferences, restoration and recovery use browser storage. No additional database server, broker, vector database or hosted storage service is established as necessary by the inspected execution path. [S30–S33]

## 3. Architecture Layers

| Layer | Actual responsibilities and boundaries |
|---|---|
| Frontend application | React screen state, search and lecture interaction, YouTube player, text/audio explanations, voice UI, Help, keyboard accessibility and browser persistence. Optional Electron desktop host. |
| Backend and API | FastAPI validation/serialization, account authorization, personal learning operations, shared lecture APIs, voice endpoints and separate Ask/Quiz services. |
| Processing and orchestration | Persistent video processing jobs; detection-only orchestration; durable evidence/text/speech preparation; private on-demand request/session lifecycle around shared jobs. |
| Multimodal processing | Video identity/ingestion, parallel transcription and frame analysis (including optional gesture/interaction-cue analysis), intervention synchronization, visual understanding, canonical evidence/context assembly, explanation and speech generation. |
| AI inference | Default Modal/vLLM Qwen VLM; selected explanation LLM; CPU voice models/Piper; independent Ask/Quiz text provider. Alternative providers are conditional selections. |
| Storage | SQLAlchemy/local-default SQLite; filesystem artifacts, media and checkpoints; browser preferences, account restoration and recovery/quiz-attempt stores. |
| Explanation delivery | HTTP status/text, validated complete audio or attempt-scoped NDJSON PCM streaming; frontend HTML Audio/Web Audio and accessible DOM/live-region output. |

These boundaries describe source ownership. Effective hosting, installed model availability and successful inference remain unverified. [S01–S35]

## 4. Core Architecture Components

| Component | Layer | Responsibility | Technologies | Status |
|---|---|---|---|---|
| Accessible Application | Frontend | Main screens, navigation, explanation interaction and accessibility | React, Vite, Tailwind, jsPDF | implemented [S01–S04, S08] |
| Electron Host | Frontend runtime | Optional desktop renderer host and packaged asset transport | Electron, loopback static HTTP, explicit permission policy | implemented; runtime unverified [S09] |
| Lecture Player | Frontend | Direct lecture playback, seeking, intervention pause ownership and startup readiness | YouTube IFrame API | implemented [S04] |
| Voice Interaction | Frontend | Microphone turns, contextual commands, clarification and feedback | Browser microphone/audio APIs, React context | implemented [S07] |
| Browser State and Preferences | Frontend storage | Preferences, account restoration, note recovery and quiz attempts | localStorage/session adapters, IndexedDB | implemented [S06, S33] |
| FastAPI API | Backend | Validate and route requests; return status, text, media or errors | FastAPI, Pydantic | implemented [S10, S11] |
| Accounts and Personal Learning Data | Backend | Local account/session authorization and owned history, saves, library and recordings | Argon2, bearer sessions, SQLAlchemy, media handlers | implemented; local-use boundary [S12, S31] |
| Video Processing Jobs | Coordination | Durable admission/join, detection, persistence, retry/cancel/resume | Thread workers, SQL leases and generation ownership | implemented [S13] |
| Explanation Preparation | Coordination | Evidence, text and speech consumers; priority, checkpoints and recovery | Durable SQL state, bounded stage queues and locks | implemented [S14] |
| On-Demand Requests | Coordination | Private request identity, lecture interest and prioritized shared preparation | Authenticated `/me` routes, heartbeat, durable request records | implemented [S05, S15] |
| Lecture Q&A and Quiz | Backend | Grounded answers and screened practice questions | Transcript retrieval, optional models/gates, Pydantic | implemented; Quiz gated [S28, S29] |
| Video Ingestion | Multimodal processing | Validate video identity and prepare artifact context | Python orchestration, YouTube URL validation | implemented [S16, S35] |
| Audio and Transcription | Multimodal processing | Captions or speech recognition to timestamped transcript | YouTube Transcript API, yt-dlp/FFmpeg, faster-whisper subprocess | implemented [S17] |
| Frame and Visual Feature Analysis | Multimodal processing | Representative images, educational visual metadata, and optional gesture/interaction-cue analysis (partial capability) | FFmpeg, OpenCV, CLIP ViT-B/32; `synapse_interaction` | implemented core; gesture-related capability partial [S18, S19] |

| Multimodal Synchronization | Multimodal processing | Associate frames/speech and select intervention moments | Synchronizer, optional interaction fusion | implemented; heuristic alignment [S16, S20] |
| Visual Understanding | Multimodal processing | Per-intervention model analysis and reusable observations | SnapshotEngine and VLM adapters | implemented [S21, S22] |
| Structured Evidence and Context | Multimodal processing | Canonical evidence, validation, aligned speech and coverage planning | Pydantic evidence models, deterministic assembly/context functions | implemented [S20, S23, S24] |
| Explanation Generation | Multimodal processing | Grounded text at brief/explanatory/detailed depths | LLMSynthesizer and selected text provider | implemented; output quality unverified [S24, S25] |
| Explanation Text-to-Speech | Multimodal processing | Generate and stream explanation speech | Pocket TTS, Kokoro, PCM/MP3 artifacts | implemented [S26] |
| VLM Inference | Inference | Execute selected visual model behind adapter | Modal/vLLM Qwen3-VL default; separate local GGUF option | integrated code; service unverified [S22] |
| Explanation LLM | Inference | Generate explanatory text using one selected provider | Ollama Mistral default; remote Ministral or Gemini alternatives | integrated code; effective provider unverified [S24, S25] |
| Voice Recognition and Replies | Inference | Voice STT, intent matching and short spoken replies | faster-whisper, multilingual MiniLM, Piper | integrated code; runtime unverified [S27] |
| Q&A / Quiz Text Provider | Inference | Generate grounded answer or candidate questions | Independent text-provider factory; Gemini default | integrated code; invocation conditional [S28] |
| SQL Persistence | Storage | Shared pipeline records and owned learning/account records | SQLAlchemy; SQLite default; Alembic schema preflight | implemented [S30] |
| Artifacts and Managed Media | Storage | Frames, transcripts, evidence, text/audio, streams and saved recordings | Local filesystem, cache manifests, atomic writes/cleanup | implemented [S31, S32] |
| YouTube Services | External | Embedded playback and source metadata/captions/media | YouTube embed, transcript/search/media clients | source integration; availability unverified [S04, S17, S18, S35] |

The JSON also contains a Learner actor as the system's input/output endpoint. It is not an additional processing service.

## 5. Frontend Architecture

`synapse-web/src/main.jsx` mounts the React application. `App.jsx` owns state-driven screen selection rather than a separately declared URL-router application. Major surfaces include account/welcome, Home/search, subject lectures, lecture/explanation, timeline, library, bookmarks, notes and gated Quiz. Local state, refs, hooks and context coordinate navigation and media; the inspected application does not require a separate Redux-style store. [S01, S02, S04, S07]

`src/api.js` is the main shared lecture integration boundary. It creates and polls processing jobs, loads interventions, translates frontend `standard` depth to backend `explanatory`, and accesses explanation/preparation/audio endpoints. `src/lib/apiConfig.js` declares a local loopback API default. Mock responses require explicit opt-in and do not establish live functionality. [S03]

The lecture screen controls the YouTube IFrame player and separate explanation audio. Pause ownership distinguishes user and intervention control. The current source includes a first-explanation playback gate that checks prepared text/audio before unlocking lecture playback. Conversation state manages explanation requests, questions and review, while the lecture owns media. [S04, S05]

Personal HTTP clients in `accountSession.js`, `personalApi.js` and `lectureRequests.js` handle authenticated sessions, owned learning data, lecture heartbeat/release and explanation intents. Saved audio can require an authenticated blob fetch rather than a bare public audio URL. Account transitions fence stale operations and invalidate pending work. [S05, S06]

`VoiceControl.jsx` and its audio context integrate microphone turns with registered actions. Spoken replies can use backend speech, browser speech or live-region fallback. Keyboard shortcuts are centralized in `shortcuts.js`; Help and screen semantics provide accessible navigation. Theme variables support paper, night and sepia presentations, with study/accessibility render modes in the lecture screen. These implementations do not establish conformance or successful screen-reader usability by themselves. [S04, S07, S08]

Electron is an optional host. Its entry creates an isolated browser window, applies microphone/fullscreen permissions and serves packaged frontend assets through a trusted loopback origin. This code is not proof of a distributed installer or of automatic backend packaging. [S09]

Structured-view rendering accepts real per-point rows if supplied, or separately enabled, visibly labeled example rows. Current backend intervention/response schemas do not expose the canonical visual evidence graph as frontend structured rows. Do not depict that backend-to-structured-panel connection as completed. [S34]

## 6. Backend Architecture

`api/main.py` creates the FastAPI application and mounts video, quiz, learning-history, personal-storage, explanation-request, account and voice routes. Its lifespan checks the migration state, reconciles media, starts model warmup coordination and owns processing/preparation/on-demand managers through shutdown. Health and readiness are separate concepts in this source; process liveness is not model availability. [S10, S30]

`ProcessingJobManager` accepts or joins durable per-video work. A worker calls `PipelineOrchestrator.process_detection_only`, persists lecture/intervention context and schedules preparation modes. A successful video job therefore means initial context processing completed; individual explanations may still be preparing. Lease ownership, generation fencing and resource admission guard shared work. [S13, S16]

`ExplanationPreparationManager` owns three stages: evidence extraction, explanation text and speech generation. Different items can occupy the stages concurrently. The resource locks and selected local/remote provider determine actual overlap; this is not arbitrary parallel inference. State and checkpoints survive stages, and incomplete work can fail, defer, retry or recover without declaring all explanations ready. [S14]

`OnDemandExplanations` wraps shared preparation in owner-scoped intent and lecture-session interest. Initial lecture processing must already have started: the request handler rejects a completely unknown lecture with no processing job. A request may wait for context, resume an existing cancelled/cancelling job, resolve an existing moment or create a requested-timestamp target. The processing manager's context-ready callback reconciles waiting requests. [S15, S13, S10]

Important route families are:

| Route family | Purpose | Boundary |
|---|---|---|
| `GET /video/search`, `GET /video/meta/{video_id}` | Lecture discovery/metadata | Shared lecture API [S11, S35] |
| `POST /video/processing-jobs`, `GET /video/processing-jobs/{job_id}` and retry/cancel/resume actions | Persistent context-processing lifecycle | Shared job manager [S11, S13] |
| `POST /video/process` | Additional processing entry retained in API | Shares processing infrastructure; not a separate deployed pipeline [S11] |
| `GET /video/{video_id}/interventions` | Persisted intervention moments | Shared database-backed response [S11] |
| `/video/{video_id}/explanations/status` and intervention preparation request/retry routes | Preparation state and control | Persistent preparation manager [S11, S14] |
| `POST /video/intervention/explain`, `POST /video/intervention/explain/stream` | Explanation generation/retrieval and stream subscription | Shared preparation/service path [S11, S14] |
| `GET /video/intervention/{intervention_id}/explanation` and `/audio` | Completed explanation and audio retrieval | Current cached artifacts and metadata [S11, S32] |
| `/auth/signup`, `/auth/login`, `/auth/session`, `/auth/logout` | Local accounts and bearer session lifecycle | Local transport and account validation [S12] |
| `/me/lecture-sessions`, `/me/explanation-requests` and their actions | Owned intent, heartbeat/release, retry and review | Authenticated user/request ownership [S15] |
| `/me/` history, library, playback, saved-explanation and voice-note routes | Personal learning persistence and media | Authenticated local data scope [S31] |
| `/voice/transcribe`, `/voice/interpret`, `/voice/speak`, `/voice/warmup` | Voice command and reply pipeline | Origin checks, bounded voice work and local models [S27] |
| `POST /video/ask`, `POST /video/quiz` | Separate grounded Q&A and practice generation | Quiz additionally feature-gated [S28, S29] |

Pydantic schemas validate and serialize requests/responses. Private account routes enforce local transport, session validity and ownership; they do not imply universal account authentication on shared video/voice routes. Origin/CORS checks complement authorization. Provider errors, invalid artifacts, readiness deferrals, cancellation and retryability produce explicit failure/status paths. No universal error-free service path is implied. [S11–S15, S27]

## 7. Multimodal Processing Architecture

The API's main context job performs ingestion, parallel transcription/frame analysis, optional interaction analysis and intervention synchronization. It stops before VLM, explanation LLM and speech generation. Those stages are invoked by explanation preparation rather than being mandatory work inside every video-processing HTTP request. Older all-in-one orchestrator entry methods are not the primary API job path described here. [S13, S14, S16]

Transcription produces timestamped caption records from YouTube or a speech-recognition fallback. Frame analysis produces representative images and category/complexity metadata. Synchronization joins these inputs and selects intervention moments. After persistence, the evidence stage analyzes selected frames, canonical evidence represents the observations, and text generation receives aligned speech plus a coverage plan. Speech generation follows the text checkpoint. [S16–S18, S20–S26]

### Gesture and instructor-interaction cues (embedded capability)

Gesture/interaction-cue analysis is an **optional capability within multimodal visual processing**, not an independent architectural module or service. It aims to provide additional instructor context when available.

The connected local implementation receives the lecture video source and can write interaction episodes with temporal information and representative frames. `fuse_interactions` can combine these records with transcript/keyframe context and intervention candidates. The call is optional, follows the extraction join, and can degrade without preventing the main synchronization path. [S19, S16]

The gesture-related capability remains **partial**. The orchestrator constructs `Config(enable_hand=False)`; optional MediaPipe code exists but is not enabled in that path, and reliable gesture interpretation/association is unverified. The high-level diagram should represent this as an optional annotation within visual processing, not as a separate node or independently animated data stream. [S19]

Structured evidence assembly is deterministic backend work around VLM observations. Synchronization/context planning performs timestamp association and coverage selection; it does not independently see the image or prove the correctness of model observations. Explanation synthesis converts supported evidence and teaching context into learner-facing text. These are separate responsibilities, not interchangeable model stages. [S20, S23, S24]

## 8. AI Models and External Services

These are **source-declared integrations/defaults**, not assertions about running deployments or private environment selection.

| Role | Local-code integration | Inference/service boundary |
|---|---|---|
| Visual understanding | `Qwen/Qwen3-VL-8B-Instruct-FP8` default Modal configuration | Authenticated remote Modal/vLLM; serving definition declares vLLM `0.19.1` and L4/A10G GPU options. Actual provisioning is unverified. [S22] |
| Alternative local VLM | Qwen2-VL GGUF engine retained | Separately selected local path. Modal failures do not silently switch to it. [S21, S22] |
| Visual feature classification | OpenAI CLIP `ViT-B/32` | Lazy local model; CUDA if available, otherwise CPU. [S18] |
| Lecture transcription | faster-whisper `base` in persistent transcription worker | Caption API preferred; local speech inference on fallback. Hardware/precision follows declared selection logic. [S17] |
| Explanation LLM default | Ollama `mistral:latest` | Local Ollama HTTP service; tag is not a pinned checkpoint. [S24, S25] |
| Explanation alternatives | `mistralai/Ministral-3-14B-Instruct-2512`; Gemini provider | Explicit provider selection. Ministral has a pinned revision and separate authenticated Modal/vLLM serving definition; Gemini is an SDK-backed alternative. They do not all execute sequentially. [S24, S25] |
| Ask/Quiz generation | Independent text-provider factory; Gemini default `gemini-3.5-flash-lite` | Provider SDK/HTTP selected independently from explanation synthesis. Optional local retrieval/reranking/faithfulness paths remain feature-gated. [S25, S28] |
| Voice command STT | faster-whisper `base` default | Persistent local voice worker, CPU int8 by declared loader. [S27] |
| Voice intent matching | `paraphrase-multilingual-MiniLM-L12-v2` | Local embedding model plus catalog/context interpretation. [S27] |
| Explanation speech | Pocket TTS `4.0.1`, voice `alba`; Kokoro-82M `v1.0`, voice `af_heart` fallback | Local CPU inference with prepared local assets; PCM streaming and MP3 delivery. [S26] |
| Voice replies | Piper, default `en_US-lessac-medium` | Separate local speech engine; not the main explanation TTS. [S27] |
| Gesture/interaction cues within visual processing | Optional `synapse_interaction` / MediaPipe code | Embedded, partial capability; hand path disabled in the inspected orchestrator configuration. [S19] |
| Video platform | YouTube embed, caption/search/media clients | External lecture playback and backend source acquisition, with distinct communication paths. [S04, S17, S18, S35] |

The inspected main path does not establish a required YOLO object-detection service. Model capability, output accuracy and infrastructure capacity should not be inferred from dependency presence or serving configuration alone.

## 9. Database and Storage Architecture

`api/database.py` creates SQLAlchemy sessions and a configurable engine. Its default points to local SQLite, with declared foreign-key, concurrency and journal settings. Startup requires a current Alembic schema. There is no evidence here requiring a separate database server in the default topology. [S30]

Shared records include videos, timestamped transcripts, intervention moments, explanation artifact metadata, processing jobs/requested modes and preparation state. Private records include users/credentials/sessions, lecture interest, owned explanation requests, learning activity, library/playback, saved explanations and voice-note metadata. Personal data ownership is enforced by handlers and account dependencies, rather than by assigning each user a separate AI pipeline. [S12–S15, S30, S31]

The local `data/` hierarchy holds per-video frames and transcript JSON, intervention evidence snapshots, depth-specific text/audio and cache manifests. Stream journals and temporary artifacts belong to active attempts or guarded publishing. Saved media and voice recordings use managed local paths; ownership, path containment and cleanup are part of the code. Large media is not stored as ordinary explanation text rows. [S16, S21, S24, S26, S31, S32]

Cache levels differ: valid lecture context can bypass detection; current evidence can bypass VLM; a matching text checkpoint can resume speech; complete current text/audio can serve a result directly. An incomplete or stale artifact is not equivalent to a ready explanation. Text survives independently of a failed speech attempt where the checkpoint remains valid. [S13, S14, S32]

Frontend browser stores hold preferences, account restoration state, quiz attempts and note drafts/failed-upload recovery. Normal voice-note persistence uses backend files and metadata; IndexedDB recovery does not make the backend note store redundant. Quiz display preferences are currently separate from lecture display state. [S06, S33]

## 10. Complete End-to-End System Flow

1. The learner accesses React in a browser or optional Electron host. Account/welcome and application state select the appropriate screen; no deployment state is assumed. [S01, S02, S09]
2. The learner searches for or enters a YouTube lecture. Frontend adapters request metadata/search or create/join a processing job. The YouTube player has a separate direct playback connection. [S03, S04, S11, S35]
3. FastAPI validates the request. The processing manager admits/joins durable work and can reuse valid existing context. The frontend polls job status. [S11, S13]
4. On a context cache miss, the worker invokes detection-only orchestration. Ingestion starts transcription and frame analysis in parallel, then joins both branches. Caption acquisition can avoid Whisper inference. [S16–S18]
5. Visual processing also includes optional gesture/interaction-cue analysis following the extraction join. If available, interaction output may inform fusion; it is not an independent service or a mandatory dependency. [S16, S19]
6. Synchronization associates speech and keyframes to intervention moments. The job persists shared video/transcript/intervention data and schedules requested explanation modes. Initial processing completion does not mean every explanation is ready. [S13, S16, S20]
7. A learner request creates private intent within an authenticated lecture session. Initial lecture processing must already exist. The request can wait for context, resume an existing cancelled job or prioritize an available moment; context-ready callbacks reconcile waiting work. A requested timestamp can create a manual target. [S05, S13, S15]
8. Preparation claims the target. For a visual target without reusable evidence, the evidence worker calls visual understanding through the configured VLM adapter. The response is parsed, assembled, validated and checked for usability before handoff. [S14, S21–S23]
9. For manual targets marked `auto`, the service can first obtain a requested frame. If that media is unavailable, it may explicitly mark the target transcript-only and require usable saved speech. This is a separate branch, not a claim that failed visual extraction succeeded. [S14, S32]
10. The text stage aligns saved speech with the frame and assembles evidence coverage/context. The selected explanation model receives bounded grounded inputs and the requested depth. A valid text checkpoint can bypass generation. [S20, S24, S25, S32]
11. Completed text is checkpointed before speech generation. The independent CPU speech stage generates explanation audio with its configured primary/fallback engines. Evidence, text and speech work for different items can overlap under the managers' resource gates. [S14, S24, S26]
12. Owned current artifacts and final metadata are published. API polling/retrieval returns text/status and completed audio; stream subscribers can receive current-attempt NDJSON text/PCM records. Complete, validated cache reuse can skip fresh inference. [S11, S14, S26, S32]
13. The frontend renders text and controls HTML Audio/Web Audio output. Startup readiness, conversation state, pause ownership and shared audio guards decide when playback is permitted. The learner can listen, change depth, review or save an explanation. [S04–S07, S26]
14. In separate optional workflows, voice STT/intent/Piper replies invoke existing application actions; Ask/Quiz use lecture evidence and their independent provider path. Neither workflow establishes that the main VLM pipeline reruns for every command or question. [S07, S27–S29]

Error alternatives remain possible at admission, acquisition, inference, validation, audio generation and delivery. The source contains status/error responses, bounded retry/deferral, cancellation and ownership fencing. These outcomes must not animate as a completed explanation. [S11–S15, S21, S24, S26]

## 11. Component Connections

IDs match the JSON. `code-supported` means statically traced; runtime success is unverified. Execution modes describe the transfer at the stated boundary: a synchronous model call can occur inside an asynchronous background job.

| ID | Source → Destination | Data Transferred | Communication Mechanism | Status |
|---|---|---|---|---|
| e01 | Learner → Application | URL/search/actions | Accessible DOM events; event-driven | code-supported [S02, S04, S08] |
| e02 | Electron → Application | Frontend assets | BrowserWindow/local HTTP; conditional | code-supported [S09] |
| e03 | Application → Player | Video ID and playback commands | Props/IFrame API; event-driven | code-supported [S04] |
| e04 | YouTube → Player | Lecture audiovisual stream | Embed network; asynchronous | code-supported [S04] |
| e05 | Application → API | Search, processing/preparation and learning requests | HTTP JSON; asynchronous | code-supported [S03, S11] |
| e06 | API → Video Jobs | Validated video job | Internal/SQL admission; asynchronous | code-supported [S11, S13] |
| e07 | Video Jobs → Ingestion | Source URL and ownership | Background Python call; cache-miss conditional | code-supported [S13, S16] |
| e08 | Ingestion → Transcription | Video source | Extraction thread/subprocess; parallel | code-supported [S16, S17] |
| e09 | Ingestion → Frame Analysis | Video source | Extraction thread; parallel | code-supported [S16, S18] |
| e10 | YouTube → Transcription | Captions or audio | Caption/media clients; conditional fallback | code-supported [S17] |
| e11 | YouTube → Frame Analysis | Media/metadata | yt-dlp/FFmpeg; asynchronous acquisition | code-supported [S18] |
| e12 | Transcription → Synchronization | Timestamped transcript | Saved JSON/internal call after join | code-supported [S16, S20] |
| e13 | Frame Analysis → Synchronization | Frames/category metadata | Saved JSON/internal call after join | code-supported [S16, S18, S20] |

| e16 | Synchronization → Video Jobs | Detected lecture context | Python result; synchronous return | code-supported [S13, S16] |
| e17 | Video Jobs → SQL | Job/context records | SQLAlchemy guarded transactions | code-supported [S13, S30] |
| e18 | Video Jobs → Preparation | Intervention/mode work | Durable schedule; asynchronous | code-supported [S13, S14] |
| e19 | API → On-Demand Requests | Owned request/session/progress | Authenticated route call | code-supported [S05, S12, S15] |
| e20 | On-Demand Requests → Preparation | Priority or retry | Internal call/private durable link; conditional | code-supported [S14, S15] |
| e21 | Preparation → Visual Understanding | Frame/category target | Evidence worker/resource lock; cache-miss conditional | code-supported [S14, S21, S32] |
| e22 | Visual Understanding → VLM | Image/extraction input | Authenticated remote HTTP or selected local model | code-supported [S21, S22] |
| e23 | VLM → Visual Understanding | Observations/completion metadata | Adapter return | code-supported [S21–S23] |
| e24 | Visual Understanding → Evidence/Context | Canonical evidence | Checkpoint and asynchronous stage handoff | code-supported [S14, S21, S23, S24] |
| e25 | Artifacts → Evidence/Context | Saved transcript/snapshot | Conditional local reads | code-supported [S14, S20, S24, S32] |
| e26 | Evidence/Context → Explanation Generation | Aligned evidence/coverage | Internal objects | code-supported [S20, S23, S24] |
| e27 | Explanation Generation → LLM | Grounded prompt | Selected HTTP/SDK; conditional on text cache miss | code-supported [S24, S25, S32] |
| e28 | LLM → Explanation Generation | Completed text | Validated provider response | code-supported [S24, S25] |
| e29 | Explanation Generation → Speech | Checkpointed text | Stage queue/local TTS; asynchronous handoff | code-supported [S14, S24, S26] |
| e30 | Speech → Artifacts | PCM events/final MP3 | Guarded files; asynchronous publication | code-supported [S26, S32] |
| e31 | Preparation → Artifacts | Evidence/text/manifests | Guarded atomic writes | code-supported [S14, S21, S24, S32] |
| e32 | Preparation → SQL | State/explanation metadata | Short transactions | code-supported [S14, S30] |
| e33 | Artifacts → API | Valid audio/current stream journal | FileResponse/StreamingResponse | code-supported [S11, S26, S32] |
| e34 | SQL → API | Status/interventions/text metadata | SQLAlchemy reads | code-supported [S11, S30] |
| e35 | API → Application | Status, text, audio or error | HTTP JSON/MP3/NDJSON; asynchronous | code-supported [S03, S11, S26] |
| e36 | Application → Learner | Accessible text/audio | DOM, Audio/Web Audio/live regions | code-supported [S04, S07, S08, S26] |
| e37 | Application → Voice UI | Screen/action context | React context/registered handlers | code-supported [S02, S07] |
| e38 | Voice UI → API | WAV/text/command context | Voice HTTP multipart/JSON | code-supported [S07, S27] |
| e39 | API → Voice Models | Validated recognition/intent/reply work | Subprocess IPC or local Piper call | code-supported [S27] |
| e40 | Voice Models → API | Transcript/action/reply audio | Worker return/file | code-supported [S27] |
| e41 | API → Voice UI | Action/clarification/speech | HTTP JSON/audio | code-supported [S07, S27] |
| e42 | API → Accounts/Personal Data | Authentication/private operations | Dependencies and handlers | code-supported [S12, S31] |
| e43 | Accounts/Personal Data → SQL | Owned records/session digests | Authorized transactions | code-supported [S12, S30, S31] |
| e44 | Accounts/Personal Data → Artifacts | Saved media/recordings | Authorized managed file operations | code-supported [S31] |
| e45 | On-Demand Requests → SQL | Intent/interest/progress | Short transactions | code-supported [S15, S30] |
| e46 | Application → Browser Storage | Preferences/session/recovery/attempts | Browser storage adapters | code-supported [S06, S33] |
| e47 | API → Ask/Quiz | Question/options/context | Internal call; quiz conditional | code-supported [S11, S28, S29] |
| e48 | SQL → Ask/Quiz | Transcript/moment metadata | Queries | code-supported [S11, S28] |
| e49 | Artifacts → Ask/Quiz | Transcript/available visual context | Conditional file reads | code-supported [S11, S28] |
| e50 | Ask/Quiz → Text Provider | Grounded bounded prompt | Selected SDK/HTTP; conditional | code-supported [S28] |
| e51 | Text Provider → Ask/Quiz | Answer/candidate questions | Provider return, validation/screening | code-supported [S28] |
| e52 | Ask/Quiz → API | Answer/sources or screened quiz | Validated result | code-supported [S11, S28] |
| e53 | Ingestion → Artifacts | Lecture extraction artifacts | Orchestrated writes from extraction responsibilities | code-supported [S16–S19] |
| e54 | Preparation → Explanation Generation | Explicit transcript-only context | Conditional target-kind branch | code-supported [S14, S24, S32] |
| e55 | Artifacts → Preparation | Reusable checkpoints/audio | Conditional manifest/file validation | code-supported [S14, S32] |
| e56 | API → YouTube | Search/metadata query | Provider clients; conditional | code-supported [S11, S35] |
| e57 | On-Demand Requests → Video Jobs | Existing-job resume/cancel | Conditional lifecycle call; does not create first job | code-supported [S13, S15] |
| e58 | Video Jobs → On-Demand Requests | Context-ready notification | Callback to request reconciliation | code-supported [S10, S13, S15] |

## 12. Architecture Limitations

- Gesture Detection is partial and optional. Its hand path is disabled by the orchestrator; semantic gesture association and successful runtime integration are unverified. [S19]
- Canonical backend evidence is not connected to the frontend structured-view rows through the current response schemas. Labeled frontend example rows are not extracted lecture evidence. [S34]
- No application, tests, model calls, external APIs or deployment environments were executed for this export. Accuracy, accessibility usability, latency and reliable live integration are not established by static source. Source defaults do not identify the effective private environment configuration.
- Local accounts/personal media require local transport. The source does not establish a general remotely authenticated multi-user deployment, nor universal authentication for all shared pipeline routes. [S06, S12]
- A wholly unknown lecture cannot enter on-demand explanation processing without initial processing first. Pending context can delay private request resolution. [S15]
- Quiz and optional retrieval/faithfulness paths are gated independently. Source code and screening do not prove question correctness or successful enabled deployment. [S28, S29]
- The Electron wrapper does not by itself prove a packaged backend/model installation. Local model assets, optional dependencies and remote service availability remain unverified. [S09, S17, S22, S25–S27]
- This is a high-level architecture: internal prompts, selection/detection algorithms and detailed model budgets are intentionally outside its scope. The presentation generator itself is not part of the audited application.

## 13. Presentation Diagram Specification

Use the companion JSON as the authoritative machine-readable component/connection inventory. It provides stable IDs, groups, statuses, Lucide icon names and self-contained evidence references. It contains no layout coordinates, colors, measured durations, particle speeds or slide styling.

**Groups and components:**

| Group ID | Boundary | Components |
|---|---|---|
| `user` | Learner input/output | `learner` |
| `frontend` | Browser or optional Electron application | `frontend_app`, `desktop_runtime`, `video_player`, `voice_ui`, `browser_storage` |
| `backend` | API and work coordination | `api`, `accounts`, `jobs`, `preparation`, `owned_requests`, `ask_quiz` |
| `multimodal` | Major processing responsibilities | `ingestion`, `transcription`, `frame_analysis` (includes optional gesture/interaction cues), `synchronization`, `visual_analysis`, `evidence_context`, `explanation_generation`, `speech_generation` |
| `inference` | Actual inference communication boundaries | `vlm_service`, `explanation_model`, `voice_service`, `qa_model` |
| `storage` | SQL and local filesystem | `database`, `artifact_storage` |
| `external` | External lecture source | `youtube` |

**Directed main pathway:** learner → application → API → video jobs → ingestion. Ingestion forks into transcription and frame analysis; both converge at synchronization. Synchronization returns context to jobs, which persist it and schedule preparation. Preparation invokes visual understanding; selected VLM observations become canonical evidence/context; selected explanation LLM yields text; text enters speech generation; metadata/artifacts reach the API and application for accessible output. Connections use the edge IDs listed in Section 11 and the JSON (the former gesture-only `e14`/`e15` edges are intentionally omitted).

**Gesture treatment:** gesture detection/interaction cues belong **inside visual processing** as a partial optional capability. Represent the capability with a small annotation on the `frame_analysis` node if desired, not an independent node, service, or animated connection. The source indicates optional interaction fusion in synchronization; do not imply that complete semantic gesture interpretation or a mandatory gesture flow is working.

**Independent pathways:** YouTube sends playback media directly to the player; API search/metadata is another external path. Voice UI uses API voice services and reuses existing actions. Personal data uses account-authorized SQL/files plus separate browser state. Ask/Quiz uses available lecture evidence and its independent provider. These are not mandatory steps in the main explanation chain.

**Branches and convergence:** preserve caption-versus-Whisper alternatives, context/evidence/text/audio cache levels, explicit requested-timestamp transcript-only targets, mutually selected model providers, and stream-versus-complete-audio delivery. Fresh frame acquisition belongs within preparation for manual targets; it is not another standalone high-level service. Optional interaction scanning follows the extraction join. Different explanation items can occupy the evidence/text/speech stages concurrently; do not depict their per-item dependencies as unordered.

**Animation:** `flows` are subgraphs, not necessarily a single ordered path. `animationPhases` provide logical progression, branch conditions, extraction parallel edge sets, convergence and component activation. Select a scenario before activating conditional edges. Never animate failures, unverified embedded gesture processing or unavailable model dependencies as successful explanations. The graph describes illustrative code paths rather than observed live traffic.

## 14. Source Evidence

The JSON repeats these references in `metadata.evidenceIndex`, so it can be consumed independently. IDs refer to local files/functions, not documentation claims or test outcomes. No line numbers are invented; symbol references avoid dependence on shifting line positions.

| ID | Relative source paths and relevant symbols | Architecture evidence |
|---|---|---|
| S01 | `synapse-web/package.json`; `synapse-web/src/main.jsx` | Framework declarations and actual React entry |
| S02 | `synapse-web/src/App.jsx`: application composition/screen selection | Screens, account gate and state-driven navigation |
| S03 | `synapse-web/src/api.js`: processing/polling/preparation adapters; `src/lib/apiConfig.js` under the same frontend root | HTTP integration, mode mapping, local default and explicit mocks |
| S04 | `synapse-web/src/components/Explanation.jsx`; `synapse-web/src/hooks/useLecturePlaybackGate.js`: `useLecturePlaybackGate` | YouTube/media state, explanation display and first-explanation readiness |
| S05 | `synapse-web/src/hooks/useExplanationConversation.js`; `synapse-web/src/lib/lectureRequests.js`: session/request helpers | Conversation, owned intents, heartbeat and release |
| S06 | `synapse-web/src/lib/accountSession.js`; `synapse-web/src/lib/personalApi.js` | Account restoration, authorized HTTP/blob access and local transport restriction |
| S07 | `synapse-web/src/voice/VoiceControl.jsx`, `VoiceAudioProvider.jsx`, `voiceSpeech.js` | Scoped voice turns, audio arbitration and speech fallback |
| S08 | `synapse-web/src/lib/shortcuts.js`; `synapse-web/src/components/HelpDialog.jsx`; `synapse-web/src/index.css` | Keyboard/help accessibility and themes |
| S09 | `synapse-web/electron.cjs`: `createWindow`; `synapse-web/electron/localFrontend.cjs`: `startLocalFrontend`; `synapse-web/electron/permissions.cjs` | Optional desktop runtime, trusted local asset origin and permissions |
| S10 | `api/main.py`: `app`, `lifespan`, `readiness_check` | Mounted routes, worker ownership, context-ready wiring and startup/shutdown |
| S11 | `api/routers/video.py`: processing/explanation/stream/audio/Ask handlers; `api/schemas.py` | Shared API contracts and result/media delivery |
| S12 | `api/auth.py`: `get_current_user`, `local_transport`, `check_session_at_commit`, account handlers; `api/security.py` | Local identity, authorization, token digests, expiry/revocation and origin rules |
| S13 | `api/processing_jobs.py`: `ProcessingJobManager`, `_run_claimed`, `_schedule_modes`, `persist_processing_result`; `api/resource_guard.py` | Durable jobs, detection invocation, context persistence and request reconciliation callback |
| S14 | `api/explanation_preparation.py`: `ExplanationPreparationManager`; `api/explanation_service.py`: preparation/generation/cache helpers | Three stages, checkpoints, resource boundaries, recovery and cancellation |
| S15 | `api/on_demand.py`: `OnDemandExplanations`; `api/routers/explanation_requests.py` | Owned sessions/intent, context wait, manual targets and existing-job lifecycle actions |
| S16 | `orchestrator/orchestrator.py`: `process_detection_only`, `_ingest`, `_execute_parallel_extraction`, `_synchronize` | Actual context pipeline ordering and optional interaction integration |
| S17 | `transcription/process_runtime.py`: `_run_worker`, `TranscriptionProcessRuntime`; `transcription/transcriber/transcription_engine.py`: `TranscriptionEngine.transcribe`; `whisper_runner.py` in the same directory | Captions-first fallback and persistent Whisper base worker |
| S18 | `frame_extraction/pedagogical_extractor_v2.py`: `extract_pedagogical_keyframes`, `get_clip` | Frame/media extraction and local CLIP feature classification |
| S19 | `synapse_interaction/detector.py`: `detect_interactions`; `fusion.py`: `fuse_interactions`; `hand.py`; orchestrator interaction calls | Partial optional gesture/interaction capability embedded in visual processing; disabled hand path |
| S20 | `synchronizer/synchronizer.py`: `Synchronizer.detect_suffer_points`, `reconcile_visual_evidence`; `synthesizer/context_manager.py`: `get_aligned_context` | Intervention synchronization and post-VLM speech/visual coverage planning |
| S21 | `orchestrator/orchestrator.py`: `extract_visual_evidence`; `vlm_engine/snapshot_engine.py`: `SnapshotEngine.analyze_frame`; `vlm_engine/evidence_refinement.py` | Per-intervention VLM path and bounded conditional refinements |
| S22 | `vlm_interface/modal_vlm_interface.py`; `modal_inference/config.py`; `modal_inference/app.py`; `vlm_engine/gguf_vlm_engine.py` | Default remote Qwen serving/adapter and separate local alternative |
| S23 | `visual_evidence/models.py`, `assembler.py`, `validation.py`, `usability.py` | Canonical evidence, deterministic assembly, structural validation and usability |
| S24 | `orchestrator/orchestrator.py`: `synthesize_intervention_text`; `synthesizer/llm_synthesizer.py`: `weave`, `_call_llm`, `explain_transcript`; `synthesizer/configuration.py` | Grounded text synthesis, explicit transcript-only branch and provider choice |
| S25 | `llm_interface/ollama_client.py`, `modal_mistral_provider.py`, `gemini_provider.py`; `modal_inference/mistral_config.py`, `mistral_app.py` | Local/remote text-model boundaries and source-declared model identities |
| S26 | `orchestrator/orchestrator.py`: `generate_intervention_audio`; `tts_engine/tts_engine.py`, `providers.py`, `streaming.py`; `synapse-web/src/lib/ttsStream.js` | Explanation speech generation, journals, final audio and frontend streaming |
| S27 | `voice/routes.py`: transcribe/interpret/speak/get_tts; `voice/stt.py`, `interpret.py`, `process_runtime.py`, `piper_speaker.py` | Separate command recognition/interpretation and Piper reply pipeline |
| S28 | `qa/service.py`, `retrieval.py`, `hybrid.py`, `faithfulness.py`; `quiz/service.py`; `api/routers/quiz.py`; `llm_interface/providers.py` | Grounded Ask/Quiz, independent provider and optional model/gate paths |
| S29 | `synapse-web/src/components/AskLecture.jsx`, `QuizScreen.jsx`; `synapse-web/src/lib/quizFlag.js`; `quiz/config.py` | Frontend integration and independent quiz availability gates |
| S30 | `api/database.py`: engine/session helpers; `api/models.py`; `api/migrations.py` | SQL persistence structure and schema preflight |
| S31 | `api/personal_storage.py`: `snapshot`, `publish`, `media_path`, `reconcile_media`; `api/routers/personal_storage.py`, `learning_history.py` | Owned learning records, managed saved media and voice-note files |
| S32 | `explanation_cache.py`; `api/explanation_service.py`: `resolve_explanation_audio_path`, `_extract_requested_frame` | Cache levels, valid audio boundary and requested-frame fallback |
| S33 | `synapse-web/src/storage.js`; `synapse-web/src/lib/notesStore.js`, `backendNotes.js`, `quizStore.js`, `displayPrefs.js`; `synapse-web/src/hooks/useVoiceRecorder.js`, `useQuizSession.js` | Actual browser storage consumers, draft recovery and quiz-attempt persistence |
| S34 | `synapse-web/src/lib/structuredViewDemo.js`: `resolveStructuredView`; `api/schemas.py`: intervention/explanation responses | Structured-view integration gap and explicit demo labeling |
| S35 | `api/youtube_search.py`: `YouTubeSearchService`; `youtube_runtime.py`: video ID/runtime helpers | YouTube search/media access and video identity boundary |

Only the two requested architecture files were authored for this revised export. Earlier draft artifacts already in `presentation_export/` were left untouched. No earlier test results, runtime observations, external references or repository-version information are used as evidence in these files.
