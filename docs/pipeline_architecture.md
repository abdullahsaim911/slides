# Synapse Detailed Pipeline Architecture

**Authority:** Current local application source. **Verification:** Static source inspection only. No application, tests, builds, inference, external services or repository operations were executed for this export. Private environment files were not used. Model names, thresholds and limits below are code declarations, not verified runtime settings or performance measurements.

Paths are relative to the workspace root. The pipeline source is at the root; its frontend consumer is under `synapse-web/`. Evidence IDs resolve in Section 18 and the companion [pipeline_architecture.json](pipeline_architecture.json). `implemented` means source-connected behavior; it does not establish successful execution, model quality or deployment availability. Existing system architecture exports remain unchanged.

## 1. Pipeline Overview

The main API path has two distinct lifecycles:

1. **Lecture context processing:** a persistent video job invokes detection-only orchestration. Transcription and pedagogical frame extraction run in parallel; after their join, optional interaction detection may run, then synchronization selects intervention moments. The job persists shared lecture context and schedules requested explanation modes. [P04, P06, P08–P13]
2. **Explanation preparation:** a durable manager runs evidence extraction, explanation text generation and CPU speech generation with separate consumers. Per-item dependencies remain ordered, while different items can occupy different stages concurrently. Completed text and audio have separate checkpoints and readiness gates. [P14–P16, P23–P28]

Owned learner requests wrap this shared infrastructure with authenticated intent, active lecture interest, requested timestamps and review progress. They can prioritize work, wait for existing context, resume an existing cancelled job, or request a manual timestamp target. They do not create a first processing job for a completely unknown lecture. [P03–P05]

VLM analysis extracts visual observations; deterministic code assembles/validates canonical evidence and reconciles it with timestamp-aligned speech; the selected explanation LLM generates educational narration; local TTS produces accessible audio. These responsibilities are not interchangeable. [P17–P26]

## 2. Pipeline Entry Points

| Entry and owner | Trigger/input | Output and downstream connection | Execution mode |
|---|---|---|---|
| `POST /video/processing-jobs`; `ProcessingJobManager.create_or_join` | Validated YouTube URL and output mode | Durable job snapshot; background detection or valid context reuse; frontend polls job status | HTTP admission followed by background thread work [P02, P04] |
| Job retry/cancel/resume handlers | Existing job identity and action | New/continued or fenced job generation; durable status | Conditional lifecycle action [P02, P04] |
| `POST /video/process` | Same URL/mode request | Creates/joins **the same job manager**, waits for context completion and returns persisted video/intervention response | Blocking wait in a plain FastAPI handler; not a second independent full pipeline [P02] |
| `PipelineOrchestrator.process_detection_only` | Video source and optional continuation check | Video directory, transcript, keyframe result and intervention candidates, or error result | Background worker invokes synchronous orchestration with internal extraction threads [P06] |
| `schedule_video` on preparation manager | Persisted video and requested mode | Per-intervention preparation rows and queue entries | Background scheduling after context; can also reopen/recover existing work [P04, P14] |
| Shared preparation request/retry and `/video/intervention/explain` | Video, intervention and one of `brief`, `explanatory`, `detailed` | Existing complete artifact or admitted/joined preparation; explain can wait for result | Conditional cache/join/generation path [P02, P14, P15] |
| `POST /video/intervention/explain/stream` | Same shared target/depth | Admits a target, then subscribes to its audio attempt or reports ready/error; NDJSON response | Streaming response around manager-owned work [P02, P28] |
| `/me/lecture-sessions` and `/me/explanation-requests` | Authenticated session interest, operation identity, timestamp/depth and optional intervention | Private intent linked to existing/shared or manual target; priority/retry, progress and saved-result links | Event-driven HTTP plus durable maintenance reconciliation [P03, P05] |
| `_run_evidence_worker` | Claimed pending preparation | Usable snapshot, reused snapshot path, explicit transcript artifact or classified failure | One evidence consumer; serialized extraction resource [P14, P15] |
| `_run_explanation_worker` | Evidence handoff | Checkpointed text and `text_ready` attempt notification; bounded handoff to speech | One text consumer; selected provider call blocks its worker [P14, P23, P24] |
| `_run_tts_worker` | Text handoff | Audio generation, complete artifact publication and ready state, or failure | One speech consumer; shared CPU speech admission [P14, P26] |
| Lifespan/startup/maintenance | Existing durable jobs, expired leases, deferred readiness, shutdown/startup | Eligible recovery/requeue, warmup state and fenced side effects | Background lifecycle maintenance; no unconditional retry guarantee [P01, P04, P14] |

**Retained alternatives:** `process_video` and `process_video_intervention_only` in the orchestrator are older whole-workflow entry methods. They are not what `ProcessingJobManager._run_claimed` invokes. `synthesize_intervention_explanation` combines text/audio for compatible callers; production preparation normally uses split methods. A caller-supplied generator/evidence preparer can replace the normal path, including in tests; this is not evidence of another deployed service. [P04, P14, P15, P32]

## 3. Execution Modes

| Mode | Actual scope |
|---|---|
| Lecture-wide preprocessing | Initial extraction and intervention detection before selected-frame explanations; not VLM inference over every decoded frame. |
| Parallel extraction | Two threads: transcription and keyframes. Their join precedes optional interaction scan and synchronization. |
| Background staged preparation | One evidence, one text and one speech consumer; bounded text/speech handoffs. Different targets may overlap across stages. |
| On-demand | Existing moment or requested timestamp enters shared preparation with owned priority/interest. Processing may still be pending. |
| Conditional providers | Default remote VLM or separately selected local adapter; explanation provider selected independently. Alternatives are not a mandatory model chain. |
| Conditional refinements | Bounded focused same-VLM readings after successful Modal overview, only when eligible targets exist. |
| Cache reuse | Context, evidence, matching text and complete text/audio each have different reuse gates and resume points. |
| Explicit transcript-only | Usable saved speech for a target explicitly marked transcript kind; does not claim visual understanding. |
| Streaming delivery | Attempt-scoped PCM events can precede final MP3/ready publication. Streaming media acquisition for Whisper is a different mechanism. |
| Recovery/failure | Retry, cancellation, lease loss, provider-readiness deferral and shutdown recovery follow durable state and resource policies. |

These modes describe static control flow and concurrency boundaries. No latency, throughput, GPU utilization or model accuracy was measured. [P04–P06, P14–P28]

## 4. Detailed Processing Stages

The following tables give each major module's purpose, inputs, processing responsibility, output, owner, dependencies and mode. All entries are source-implemented unless marked partial. Concrete algorithms and limitations follow in the dedicated sections.

| Module / purpose | Input → processing responsibility → output | Owner, technologies and dependencies | Execution / status |
|---|---|---|---|
| Video jobs / control shared context work | URL/mode → admission, cache/ownership checks, detection invocation → durable job/context result | `api/processing_jobs.py`, SQLAlchemy, resource guard, orchestrator | Background thread; implemented [P04] |
| Ingestion / establish source identity | YouTube URL → validated ID/directories → per-video extraction context | `PipelineOrchestrator._ingest`, `youtube_runtime.py` | Synchronous before extraction fork; implemented [P06, P07] |
| Caption acquisition / fast transcript path | Video ID → caption fetch → timestamped entries or fallback selection | `TranscriptionEngine`, `APIFetcher`, persistent transcription process | One branch of parallel extraction; implemented [P08, P09] |
| Audio/Whisper / fallback speech recognition | URL/audio → PCM/file acquisition and recognition → segment start/duration/text or failed result | `WhisperRunner`, faster-whisper base, yt-dlp, FFmpeg | Conditional, synchronous inside worker; implemented [P10] |
| Frame decode / acquire candidate images | Source stream → decode/sample/blank filter → timestamped BGR frames | `stream_frames`, OpenCV, FFmpeg | Other extraction thread; implemented [P11] |
| Visual features / classify candidate content | Images → CLIP embeddings/category comparisons and complexity → scored frames | `get_clip`, `classify_educational`, `compute_complexity_score`, PyTorch/CLIP | Local batch/iteration within frame branch; implemented [P11] |
| Keyframes / select pedagogical representatives | Scored frames → scenes, representative/coverage selection → JPEGs and keyframe manifest | `extract_pedagogical_keyframes`, scene/coverage functions | Sequential after candidate features; implemented [P11] |
| **Gesture Detection** / additional interaction context | Same video source → optional episode detection → interaction records/representative frames | `synapse_interaction`, optional MediaPipe code; orchestrator hand path disabled | Separate post-join optional module; **partial** [P12] |
| Synchronization / identify moments | Transcript/keyframes and optional episodes → temporal matching/triggers/fusion → `InterventionPoint` records | `Synchronizer.detect_suffer_points`, `fuse_interactions` | After extraction join; implemented, optional cue integration partial [P06, P12, P13] |
| Context persistence / publish lecture context | Detection result → guarded SQL/JSON persistence and callback → shared lecture rows and preparation scheduling | Job manager, models, filesystem | Short transactions after inference-free detection; implemented [P04, P30] |
| Preparation / stage ownership | Video/moment/mode → claim, priority, handoffs, maintenance → durable stage state | `ExplanationPreparationManager`, queues, SQL leases | Three workers with bounded handoffs; implemented [P14] |
| Target resolution / choose evidence route | Shared target and cache → kind/currentness checks → complete result, snapshot, visual/auto/transcript branch | `prepare_visual_evidence`, snapshot/cache helpers | Evidence resource lock; implemented [P15, P16, P27] |
| Requested frame / resolve manual auto target | Source/time → single-frame acquisition → `requested.jpg` or explicit transcript kind | `_extract_requested_frame`, yt-dlp/imageio FFmpeg | Conditional in evidence worker; implemented [P15] |
| VLM request / extract image observations | Frame/hints → image+prompt/budget+selected inference → response and completion metadata | SnapshotEngine, VLM adapter, Modal/vLLM default | Blocking model request in evidence stage; implemented integration, runtime unverified [P17–P19] |
| Evidence assembly / normalize observation contract | Compact/legacy response plus backend metadata → canonicalization/validation → evidence and diagnostics | `visual_evidence` models/assembler/validation; SnapshotEngine | Synchronous, provider-path dependent; implemented [P17, P20] |
| Focused readings / verify sensitive details | Valid overview/image → bounded same-model crops/panels → targeted updates/conflicts | `refine_critical_details`, `uncovered_panels` | Successful Modal overview only; implemented conditional path [P21] |
| Evidence checkpoint / reuse gate | Snapshot → persist/assess → usable evidence or classified unavailable result | `extract_visual_evidence`, `assess_snapshot`, quality version | Guarded atomic persistence; implemented [P16, P20, P27] |
| Context and coverage / ground synthesis | Timestamp, transcript and canonical facts → align speech, conservative matching → context and coverage plan | `ContextManager.get_aligned_context`, `reconcile_visual_evidence` | Text stage before prompt selection; implemented [P13, P22, P23] |
| Explanation inputs / select narration evidence | Evidence/context/depth → bounded payload and hash → prompt or reusable text | `LLMSynthesizer`, prompt budgeting, cache owner | Synchronous deterministic preparation; implemented [P23, P24, P27] |
| Explanation LLM / educational narration | Grounded prompt → selected provider, completion/contract checks → accepted text | Ollama default, optional Modal Ministral/Gemini | One selected provider; implemented integration, runtime unverified [P24, P25] |
| Text checkpoint / preserve generation | Accepted text/input hash → atomic text/provenance → reusable depth text | `synthesize_intervention_text`, `write_text_checkpoint` | Before speech handoff; implemented [P23, P27] |
| Explanation TTS / produce accessible audio | Checkpointed text → local CPU provider, checked PCM/encoding → stream/final MP3 | Shared `TTSEngine`, Pocket TTS/Kokoro, FFmpeg | Independent speech stage; implemented integration, runtime unverified [P26] |
| Publication and delivery / expose current results | Complete artifacts/state → validation, metadata commit, response → JSON/text/audio or errors | Explanation service/preparation manager, FastAPI, frontend audio adapters | Short transactions and asynchronous HTTP delivery; implemented [P02, P14, P15, P28, P29] |
| Lifecycle / prevent stale publication and recover | Failure/lease/readiness/cancel state → policy/ownership checks → eligible retry/recovery or terminal state | Job and preparation managers, lifespan | Background/conditional control, not a new model; implemented [P01, P04, P14] |

## 5. Audio and Frame Processing

### Source acquisition and storage

The input path validates/extracts an 11-character YouTube identity and prepares a `data/<video_id>/` context. Media acquisition is delegated: frame extraction resolves source stream metadata, captions use the transcript client, and speech fallback obtains audio. Ingestion is not a single mandatory download of a complete MP4. The optional interaction path can retry with a downloaded local `video.mp4` when direct decoding fails. [P06–P12]

The job cache checks persisted context before invoking fresh extraction. Local artifacts include `transcript.json`, `keyframes/keyframes.json` and JPEGs, optional `interactions.json`/interaction frames and an interventions manifest. These are pipeline-generated artifacts, not proof of observed output quality. [P04, P06, P11, P12]

### Audio and transcription

`TranscriptionProcessRuntime` owns a restartable persistent process using framed request/response IPC. Its worker constructs `TranscriptionEngine(whisper_model="base")`; warmup can load the fallback recognizer before a real request. A warm recognizer does not mean captions are skipped: `TranscriptionEngine.transcribe` still tries `APIFetcher.fetch` first unless its caller explicitly bypasses the API. [P08, P09]

On caption failure, `WhisperRunner` uses faster-whisper. Default device/compute selection is CUDA/float16 when available, otherwise CPU/int8, with declared configuration overrides. The API path's engine chooses `auto` unless streaming is preferred; **for a URL, `WhisperRunner.transcribe(mode="auto")` selects its stream acquisition path**. That path pipes yt-dlp to FFmpeg 16 kHz mono PCM, reads the entire result into memory, converts it to float samples and then transcribes. It is not incremental real-time transcription merely because the method is named `transcribe_stream`. Alternative file/download mode extracts audio and cleans its temporary file. [P09, P10]

Whisper segments are serialized as `start`, `duration = end - start`, and `text`; caption entries use the compatible timestamped representation. `TranscriptionResult` includes method, error, entries, media duration derived from segment endpoints and separate processing duration. The orchestrator writes the returned result atomically to `transcript.json`, and job persistence creates transcript rows. [P04, P06, P09, P10]

**Missing-data behavior:** an exception escaping the transcription call is captured by the extraction thread and causes detection failure after join. Separately, `TranscriptionEngine` can catch inference failure and return a non-`None` failed result with empty entries. The orchestrator checks for raised extraction error/`None`, not universally for a nonempty usable transcript. Such an empty result can reach synchronization. This distinction prevents claiming that every joined job has successfully recognized speech. Worker process restart and warmup lifecycle are implemented; successful recovery was not executed here. [P06, P08, P09]

### Frame decoding, classification and selection

`extract_pedagogical_keyframes` resolves video stream URL, dimensions and duration. `stream_frames` uses FFmpeg's `fps` filter to produce raw `bgr24` frames and derives timestamps from the sampled frame index. Defaults are **0.5 sampled frames/second**, minimum keyframe gap **4 seconds**, maximum coverage gap target **30 seconds**, and semantic similarity threshold **0.92**. These are source parameters, not guaranteed measured coverage. Decode retry logic can resume near the current sampled index; clean/short EOF terminates the stream. [P11]

Mostly blank candidates are filtered. CLIP `ViT-B/32` loads lazily on available CUDA or CPU. Image embeddings support scene comparisons; classification compares educational category prompt ensembles with non-educational prompts. The category's mean similarity competes with the highest non-educational score. `classification_confidence` and compatibility `clip_confidence` hold raw similarity, with `confidence_semantics="clip_similarity"`; they must not be presented as calibrated probabilities. [P11]

Complexity is independent of CLIP confidence. OpenCV features include Canny edge density, text-like binary transitions, Laplacian contrast, Sobel gradient magnitude and hue variance, weighted respectively **0.30, 0.25, 0.20, 0.15 and 0.10**, bounded to 1. This is a content-richness heuristic, not proof of pedagogical importance. [P11]

Adaptive scene segmentation compares consecutive embeddings, using a threshold bounded below at 0.70 and otherwise based on similarity mean minus 1.5 standard deviations, subject to spacing. Scene selection prefers educational candidates with sufficient complexity and can use a fallback for temporal coverage. Crucially, `is_semantically_redundant` is called, but **the scene representative is still saved when similarity is high** after temporal spacing passes. Do not depict semantic deduplication as a hard removal gate. `ensure_temporal_coverage` then adjusts representatives using declared duration-derived frame-count targets and gap constraints. [P11]

JPEG filenames and `keyframes.json` preserve frame path, numeric seconds, formatted timestamp, label, complexity, similarity/confidence semantics and raw category label. This frame classifier supplies a hint; the VLM performs the later detailed visual understanding and can discover additional categories. No standalone YOLO/object-detection service is required by this execution path. [P11, P13, P17]

## 6. Gesture Detection — Separate Module

**Analyzes instructor gestures and interaction cues to provide additional contextual information for multimodal understanding.**

| Attribute | Source-supported behavior |
|---|---|
| Main input | Same lecture video URL/source used by the orchestrator; local MP4 retry is possible. It is not an input stream of CLIP embeddings. |
| Main output | Interaction episodes with temporal/type/context metadata and optional representative-frame paths; saved `interactions.json`. |
| Owner | `synapse_interaction/detector.py: detect_interactions`; configuration in `config.py`; fusion in `fusion.py`. |
| Invocation | `_execute_parallel_extraction` invokes it **after** transcription and frame threads join, when interactions are not explicitly disabled. |
| Downstream connection | `_synchronize` optionally calls `fuse_interactions` with detected candidates and saved transcript/keyframe context. |
| Failure/dependency | Detection and fusion can degrade without aborting the ordinary keyframe/transcript synchronization path. |
| Status | **Partial, optional and runtime unverified.** The orchestrator passes `Config(enable_hand=False)` despite optional MediaPipe implementation existing in `hand.py`. |

The connected path provides heuristic interaction/writing context; this does not prove fully functional hand recognition, accurate pointing or reliable gesture-to-object semantics. No internal gesture algorithms/submodules are expanded in this export. The JSON keeps `gesture_detection` separate, icon `hand`, with partial incoming/outgoing edges that are excluded from confirmed-flow animation. [P06, P12]

## 7. Multimodal Synchronization

`Synchronizer` loads timestamped transcript and keyframe JSON after extraction join. It matches a frame to a containing transcript segment or nearest segment endpoint within **30 seconds**. It scores deictic references, negative deictic transitions, short-speech/high-complexity situations and visual complexity. Active constants are deictic **+50**, silent drawing **+80**, high complexity **+50** above **0.30**, negative deictic **−50**, and intervention score threshold **50**. The class docstring's older high-complexity score does not override the current constant. [P13]

Candidates can also enter through a visual-only path when complexity exceeds **0.25**, even below score threshold. Interventions within **5 seconds** of the prior selected moment are suppressed. Output `InterventionPoint` records include timestamp, frame path, content type, complexity, transcript context, trigger reason, heuristic confidence and preserved category/confidence semantics. Category normalization maps recognized legacy labels to canonical categories and retains unknown/ambiguous information. [P13]

Optional interaction fusion can modify the candidate list using episode and temporal context; it is not required to produce candidates. Empty transcripts can leave visual candidates without matched speech. The synchronizer's construction derives segment end from `start + duration`; later text-stage conversion accepts explicit `end` when present. Different consumers are not assumed to normalize every arbitrary transcript format identically. [P06, P12, P13, P23]

This initial synchronization is **before VLM inference**. The later visual/transcript coverage plan is **after VLM inference** and serves a different purpose. Heuristic confidence labels and temporal proximity are not measured semantic synchronization accuracy. [P13, P23]

## 8. VLM Inference

### Entry, target and provider selection

The evidence worker calls `prepare_visual_evidence`. It loads the shared target, checks complete current cache and enters `VLM_EXTRACTION_LOCK`. An `auto` manual target first attempts requested-frame acquisition; an explicit transcript target returns an `_transcript_only` artifact only with usable saved speech. Visual targets call `PipelineOrchestrator.extract_visual_evidence`. [P14–P16]

`extract_visual_evidence` first tries `load_usable_snapshot` plus the current quality version. On a miss it checks frame existence, ownership and provider readiness, then constructs the selected engine. Default provider is Modal. The local GGUF path is separately selected; Modal exceptions do not trigger silent local-model fallback. Optional local Ollama prewarming may overlap remote VLM work when that explanation provider is selected, but failure to prewarm is nonfatal. [P16–P19, P25]

### Modal image and prompt construction

`SnapshotEngine._build_prompt` combines the active common compact-observation contract with applicable canonical category directives and category hint information. Hints are not a restriction to one category. A low-confidence warning is added only when the supplied semantics identifies a classifier probability; raw `clip_similarity` is not treated identically. The contract requests meaningful regions, unique occurrences, relationships, exact visible content, structure and uncertainty. [P13, P17]

The Modal adapter converts the source to RGB, downsizes while preserving aspect ratio to a maximum dimension of **1344**, JPEG-encodes at declared quality **85**, and rejects encoded payloads over **10 MiB**. It uses the actual dispatched JPEG for budget accounting. The separate `image_preprocessor.py` utility declares a different local maximum; it is not the authority for the Modal request limit, and its old docstring is not proof of the active bound. [P18, P19]

### Serving and tokens

The default serving definition names **`Qwen/Qwen3-VL-8B-Instruct-FP8`**, vLLM **0.19.1**, GPU choices **L4/A10G**, one image and no video per prompt, one concurrent sequence, context **12,288 tokens** and output ceiling/default structured request **8,192 tokens**. These declare a serving profile; no deployed hardware, loaded weights or memory fit was verified. [P19]

The ordinary remote adapter obtains native multimodal input count through serving **`/tokenize`**, verifies the serving context contract, and reserves **32 tokens** beyond input plus requested output. If exact accounting shows that the requested tail cannot fit, it may reduce effective output to available context, but rejects if fewer than **512** completion tokens remain. A separately supplied context estimator is supported; exactness requirements must still pass. The adapter then posts an OpenAI-compatible multimodal request to **`/v1/chat/completions`**, with structured JSON decoding for the compact schema. Default temperature is **0.1**. Configured output capability and effective per-request limit are different values. [P18, P19]

Transport retries selected transient/timeouts with bounded backoff; authentication and permanent remote rejection do not retry at this layer. Network/service readiness and valid credentials remain unverified. No private endpoint or authentication value is included here. [P18]

### Parsing, finish state and refinement

`_parse_json_response` attempts structured JSON parsing and bounded formatting cleanup. Parsing success is not enough: `_attach_visual_evidence` normalizes observations and records completion metrics/diagnostics. `finish_reason="length"` identifies truncation; `stop` is normal completion; unknown terminal states do not upgrade evidence to complete. When finish metadata is absent, token count at the limit is a fallback truncation signal. Malformed JSON and genuine truncation have distinct failure classifications. [P17]

After a successful Modal overview, `refine_critical_details` can make **at most three** additional same-model readings. Targets include precision-sensitive text/math/code/chemical details, connector direction/radial patterns and uncovered panels proposed from observed dividers. Distinct panels are prioritized; crops are not arbitrary quadrants. Focused results and conflicts are archived, readability is not scientific correction, and unsupported interpretations are not promoted to facts. No eligible targets means no extra reading. [P21]

The GGUF engine has its own `analyze_frame` path and bypasses the ordinary compact-prompt/parser path; canonical behavior and quality must not be assumed equivalent. The same downstream usability gate still governs acceptance. The diagram's detailed successful extraction sequence primarily describes the default Modal/SnapshotEngine path. [P17, P19, P20]

Both usable and failed snapshots can be written to `vlm_snapshot.json`. The evidence worker raises an unavailable-evidence failure when assessment rejects the result; an existing file is not a valid visual explanation. Ownership is checked after inference and before guarded publication. [P15, P16, P20]

## 9. Structured Visual Evidence

Canonical `VisualEvidence` schema version is **`1.1.0`**. The compact model response is an observation contract, not the final backend-owned record. Deterministic assembly combines observed content with frame identity, timestamps, category normalization, provenance and diagnostics. Legacy adapters are compatibility paths and do not justify inventing missing observations. [P17, P20]

| Representation | Supported fields / constraints |
|---|---|
| Scene | Schema version, extraction/evidence status, category IDs, frame/timestamp, global layout, structural description and reading order |
| Regions/elements | Stable IDs, categories, supported descriptions, labels/exact text, normalized bounds/position, attributes and containment hierarchy |
| Relationships/topology | Referenced endpoints, relationship type, direction, label, evidence status and cross-category/source references |
| Exact content | Text with notation such as plain, math, code or chemical, status and source reference |
| Structure | Overview, component/relation references, reading order, hierarchy/topology notes and uncertainties |
| Provenance/uncertainty | Model/provider/generation and source metadata, local diagnostics, unsupported/ambiguous/unreadable details |

The twelve categories are CT-01 chart, CT-02 mathematics, CT-03 scientific structure, CT-04 flow/network, CT-05 table, CT-06 structured text, CT-07 geometry, CT-08 programming, CT-09 interface, CT-10 map, CT-11 observational image and CT-12 physical scene. Multi-category scenes and cross-category relationships are representable. [P20]

Validation checks status consistency, category values, unique IDs, normalized ordered bounds, valid relationship/hierarchy/reading-order references and containment cycles. Valid structural representation is distinct from truthful visual recognition. `_diagnose_extraction_quality` can flag observable gaps such as missing structure/positions without inventing the absent detail. [P17, P20]

`assess_snapshot` rejects error-marked snapshots, absent/invalid canonical data, failed/not-attempted extraction, wholly unavailable evidence and empty grounded content. Partial evidence can remain usable when the contract/content gates allow it; uncertainty must stay attached. `load_usable_snapshot` can adapt older snapshots in memory, leaving the original file unchanged. [P20]

## 10. Evidence Assembly and Context Planning

There is **no standalone planner service** in this path. Responsibilities are distributed explicitly:

- **Initial synchronizer:** chooses candidate moments from speech/frame metadata before VLM. [P13]
- **Canonical assembler/validator:** combines VLM observations with backend-owned metadata and checks representational invariants. It does not add unseen visual facts. [P20]
- **Context manager:** aligns nearby teaching speech around the visual timestamp. [P22]
- **Reconciliation functions:** extract bounded atomic visual facts and conservatively match speech coverage. [P13]
- **Synthesizer payload/prompt functions:** select relevant grounded records within budget and express depth/category instructions. [P24]

`synthesize_intervention_text` converts transcript dictionaries using explicit `end` where present, otherwise `start + duration`. It selects a containing teacher segment or nearest endpoint; this single-segment fallback has no maximum distance in `_find_transcript_segment`. Separately, active `get_aligned_context` requires a nearest segment within **5 seconds**, expands contiguous captions roughly **30 seconds before / 60 after**, and can extend to sentence boundaries within **45 before / 90 after**, without bridging gaps greater than **5 seconds**. All depths receive the same aligned teaching context. Older depth-specific `get_context` windows exist but do not define this active alignment call. [P22, P23]

`reconcile_visual_evidence` extracts at most **64** atomic facts by default and assigns `spoken_explicit`, `spoken_partial`, `unspoken`, `uncertain_match` or `not_usable`. Facts carry importance/reliability, source references, supporting transcript span and missing information where available. The plan's schema is `synapse_transcript_visual_coverage_v1`, method `deterministic_conservative_v2`. It guides attention and repetition; canonical evidence remains the factual source. Matching is heuristic, not a learned synchronization-confidence measurement. [P13]

Fresh snapshots may receive persisted reconciliation through guarded checkpointing; reused valid evidence is reconciled in memory rather than rewritten for every depth. `_lecture_context` is backend prompt context, kept out of persisted raw visual observations. Interaction cues can influence selected moments/trigger context, but no separate reliable semantic gesture-object payload is established in the synthesizer's visual-fact contract. [P12, P23]

## 11. LLM Explanation Generation

The selected explanation provider is independent of VLM and Ask/Quiz provider selection. Source default is **Ollama `mistral:latest`**. Explicit alternatives are **Modal `mistralai/Ministral-3-14B-Instruct-2512`** with its declared pinned revision, or a Gemini provider whose source default model is `gemini-3.5-flash-lite`. Effective selection and deployed identity were not inspected. `mistral:latest` is not a fixed checkpoint. [P25]

For a visual target, the orchestrator calls `LLMSynthesizer.weave(..., require_visual_explanation=True)`. Usability/domain/contract checks prevent a failed ordinary visual request from silently becoming a transcript-only successful visual explanation. Explicit transcript-kind targets instead call `explain_transcript`. [P15, P23, P24]

Active category-aware prompts receive canonical visual structure/exact content/uncertainty, coverage attention, aligned teaching speech, trigger context and depth. Selection preserves category coverage and meaningful records within bounds rather than copying unlimited evidence. Declared character bounds include canonical evidence **18,000**, coverage **3,000**, context **6,000** and teacher transcript **6,000**. Provider-specific token budgeting can reduce payloads, preserve the relevant current passage or reject an unfit prompt. Character caps do not alone guarantee token fit. [P24]

Depth changes narration, not raw evidence: Brief requests compact core orientation/relationships/teaching point; explanatory/standard expands the same core; detailed adds supported secondary structure and clarification. Local generation token ceilings are **768 / 1,024 / 1,536** respectively. Remote provider settings may supply a different declared ceiling; the remote Ministral profile declares **12,288** context and **4,096** output. These are request/serving limits, not measured output lengths. [P24, P25]

The local path uses current completion metadata and rejects unfinished/non-stop generation. Remote paths require accepted completion state and nonempty output. When a provider explicitly supports structured output, required blocks are visual description, educational explanation, lecture connection and uncertainty; JSON contract validation and conditional sentence source-support review apply. These provider-specific checks do not universally run on every local response. Spoken-math handling and prompt rules discourage unsupported interpretations, source correction and imagined motion, but they do not prove hallucination elimination. [P24, P25]

Before generation, the owner computes an input fingerprint from snapshot/context/category/reason/depth and can reuse matching text. Accepted new text is written through a temporary depth-specific text file and `.text-generation.json` manifest before speech work. The checkpoint records quality version, provider profile, text hash, input hash and snapshot hash; a TTS failure need not force another LLM call. Ownership checks fence late text responses and checkpoint writes. [P23, P27]

## 12. Text-to-Speech

`generate_intervention_audio` consumes a completed text artifact in the speech stage. A compatible valid final MP3 can be reused; otherwise the shared `TTSEngine` generates explanation speech. Its default provider sequence is **Pocket TTS 4.0.1 / `alba`**, then **Kokoro-82M v1.0 / `af_heart`**, using local prepared assets and CPU inference. A preferred-provider argument can select a specific supported provider. [P26]

Provider chunks become finite checked float samples, are clipped/converted to 16-bit PCM at **24 kHz**, and feed a local FFmpeg encoder for temporary MP3 output. Streaming publication uses checked PCM parts while encoding continues. Empty/invalid samples, encoder failure, invalid final audio, cancellation and ownership loss are failures. Temporary output is replaced into the intended final artifact only after successful checks. [P26]

Fallback has an important boundary: **before any stream audio is published**, a provider failure may move to the next provider in the same attempt. **After publication starts**, the engine marks an interrupted stream and raises rather than splicing two providers into one apparently continuous success. A later eligible attempt can prefer the fallback. This does not mean every failure automatically retries. [P26, P28]

The manager opens an attempt after text generation and can publish `text_ready` before the speech worker produces PCM. Attempt journals carry `start`, ordered `audio` PCM events, terminal `complete`/`error` and keepalives. `stream_explanation` admits/joins the target and subscribes to current attempt lines; a completed cached result can report cached completion instead of replaying the old stream. Final `.mp3` and `.generation.json` artifacts are distinct from a partial NDJSON journal. [P14, P27, P28]

`generate_explanation_from_evidence` validates servable MP3 and provenance before a new metadata transaction; the manager then marks ready under its lease. File delivery checks containment within the configured data root, MP3 extension/header and current cache. Frontend stream consumption checks record framing/order and uses Web Audio; ordinary completed playback uses audio responses and HTML Audio controls. [P02, P15, P28, P29]

**Voice-command replies are separate:** `voice/routes.py:get_tts` constructs `PiperSpeaker`, default voice `en_US-lessac-medium`. That short-response path is not the Pocket/Kokoro explanation stage and is not inserted into this explanation pipeline. [P31]

## 13. Orchestration, Caching and Recovery

### Ownership and resources

FastAPI lifespan requires current database schema, starts durable managers/warmup coordination and owns shutdown. Video jobs use database leases, generation identity and heartbeats. Preparation uses per-target/mode leases and tracked stage work. Expired or lost ownership prevents checkpoint/result publication; long inference is not performed inside a held database transaction. [P01, P04, P14, P15]

`VLM_EXTRACTION_LOCK` serializes visual extraction and guards repeated snapshot checks. `EXPLANATION_GENERATION_LOCK` serializes text generation. Remote Modal VLM can overlap text work; selected local VLM text work also takes the visual lock to avoid shared local GPU contention. Speech has its own shared admission/priority resource. The text and speech handoff queues each use declared capacity **4**; a full handoff can backpressure upstream work. Priority scheduling promotes learner requests while the speech queue continues draining to avoid a stalled handoff. [P14, P15, P26]

### Cache levels

| Cache level | Acceptance | Resumed/skipped work |
|---|---|---|
| Shared lecture context | `inspect_video_cache` checks persisted context completeness | Skip fresh detection; schedule requested explanation modes. |
| Visual snapshot | Usability plus current `QUALITY_VERSION` (`2026-11-14-grounded-v6` in source) | Skip repeated overview extraction across depths; do not assume image-input hash is independently recomputed at this gate. |
| Matching text | Quality/provider/text/input/snapshot hash checks | Skip LLM; resume TTS if audio invalid/missing. |
| Complete generated explanation | Current provider/TTS profiles, text/audio/snapshot provenance and servable MP3 | Skip inference and deliver ready result. API-level checks cannot independently reconstruct every synthesis input; synthesis owner additionally checks its input hash. |

`cache_is_current` compares `.generation.json` against regenerated provenance; `text_cache_is_current` can use `.text-generation.json` to preserve text across speech failure. File presence alone never establishes complete current generation. Preserved personal saved snapshots are a separate user-data concept from shared generated cache. [P04, P15, P16, P23, P27]

### Failure and recovery

Source-classified VLM errors distinguish authentication, context budget, permanent rejection, transient unavailability, malformed/truncated response and invalid evidence contract. The HTTP adapter's bounded transport retry is separate from the durable preparation attempt policy. Authentication/permanent failures are not interchangeable with readiness deferral. [P17, P18, P14]

Preparation defaults to three attempts. Retryable remote-unavailable/readiness cases can enter `waiting_for_vlm`, use a deferred probe/backoff and bounded waiting period rather than consuming an ordinary generation attempt indefinitely. Source defaults include a **30-second** readiness retry interval and **900-second** maximum wait; these are scheduling constants, not measured latency or animation durations. Stale leases, tracked in-flight work and deferred preparations have separate recovery routines. Exhausted/permanent outcomes remain failed until allowed intervention. [P14]

Cancellation/resume is generation/lease-fenced. A noninterruptible external call may finish after cancellation, but ownership checks discard its late result. Shutdown begins fencing, stops dispatch/maintenance, waits within configured grace and releases owned local services. It does not reset unrelated independently started model services. A valid text checkpoint may be reused on eligible recovery. No successful recovery was observed during this static audit. [P01, P04, P14–P16, P23, P25–P27]

On-demand lifecycle persists operation identity and active lecture interest, prevents cross-user target access, can preserve completed outputs and cancels shared work only when no interested session remains. Missing source context leaves requests waiting; a completely unknown lecture without initial job is rejected. Manual-frame fallback is restricted to explicitly transcript-kind targets with nonempty context. [P03, P05, P15]

## 14. End-to-End Pipeline Execution

### Fresh context and visual explanation

1. Video HTTP request admits/joins a durable job; invalid input, resource pressure and conflicting work can return explicit errors. [P02, P04]
2. On context cache miss, job owner calls `process_detection_only`; ingestion validates identity and creates artifact context. [P04, P06, P07]
3. Fork transcription and frame extraction. Captions or conditional Whisper produce transcript result; sampled/classified/selected frames produce JPEGs and manifest. [P08–P11]
4. Join both extraction threads. Optionally run the separate interaction module; its failure is nonfatal to ordinary matching. [P06, P12]
5. Match transcript/keyframes, select intervention points and optionally fuse interaction episodes. Persist context under the current generation, write intervention JSON, notify waiting requests and schedule modes. [P04–P06, P13]
6. Evidence consumer claims preparation. Complete cache can bypass inference; a usable snapshot can bypass VLM; otherwise visual extraction starts after readiness and ownership checks. [P14–P16]
7. Default Modal path constructs bounded image/category prompt, checks native context, performs structured inference, parses/canonicalizes and optionally makes focused readings. Persist snapshot and assess usability. Diagnostic failures stop here. [P17–P21]
8. Usable evidence enters text worker. Align saved teaching context and reconcile visual fact coverage; construct bounded category/depth inputs or reuse matching text. [P13, P22–P24, P27]
9. Selected LLM generates accepted completed text. Guarded text/provenance checkpoint precedes speech handoff. [P23–P25, P27]
10. Speech consumer generates local audio or reuses current MP3. Active subscribers may receive text/PCM attempt events before final publication. [P14, P26–P28]
11. Validate complete result, persist explanation metadata and mark ready. HTTP clients retrieve JSON/completed audio or follow the current stream; frontend media/readiness/conversation guards govern accessible output. [P02, P14, P15, P28, P29]

### Important alternatives

- **Context cached:** video job skips detection and schedules requested modes; explanation readiness remains independent. [P04]
- **Evidence cached:** usable current snapshot skips VLM and resumes alignment/text. [P16]
- **Text cached:** current input/provider/evidence fingerprint skips LLM and resumes speech. [P23, P27]
- **Complete cache:** validated current text/audio can return without new inference. [P15, P27]
- **On-demand existing moment:** private request prioritizes shared target and records review/result link. [P05]
- **On-demand timestamp:** manual `auto` target attempts `requested.jpg`; unavailable media can explicitly select usable transcript-only synthesis. [P05, P15]
- **Failed strict visual path:** unusable evidence returns failure/deferred status; it does not proceed as a confirmed visual explanation. [P14–P17, P20]
- **Cancelled or lost lease:** late side effects are fenced and eligible work may resume from validated checkpoints. [P04, P14, P23]
- **Alternative local GGUF:** retained adapter follows its own image/response code; do not replay the Modal compact-decoding/refinement phases as though they executed locally. [P17, P19]

## 15. Component Interaction Table

IDs match JSON. `code-supported` is static evidence, not runtime verification. Communication is in the JSON; conditions and payload direction are summarized here.

| ID | Source → Destination | Data Transferred | Execution Condition | Status |
|---|---|---|---|---|
| p01 | API → Video jobs | URL/mode/job action | Validated admission/lifecycle request | code-supported [P02, P04] |
| p02 | Video jobs → Ingestion | URL and ownership guard | Context cache miss | code-supported [P04, P06] |
| p03 | Ingestion → Captions | Source/ID through transcription worker | Audio extraction branch; parallel with frames | code-supported [P06, P08] |
| p04 | Ingestion → Frame decode | Video ID | Frame extraction branch; parallel with audio | code-supported [P06, P11] |
| p05 | Captions → Whisper | Audio source | Caption failure/bypass | code-supported [P09, P10] |
| p06 | Captions → Synchronization | Timestamped captions | Caption success and extraction join | code-supported [P06, P09, P13] |
| p07 | Whisper → Synchronization | Timestamped result, possibly empty failure result | Fallback returned; extraction join | code-supported [P06, P09, P10, P13] |
| p08 | Decode → Features | Timestamped images | Nonblank candidates | code-supported [P11] |
| p09 | Features → Keyframe selection | Embeddings/category/complexity | Scored candidates available | code-supported [P11] |
| p10 | Keyframes → Synchronization | JPEG paths/manifest | Extraction join complete | code-supported [P06, P11, P13] |
| p11 | Ingestion → Gesture Detection | Same video source | Optional post-join scan | **partial; no active animation** [P06, P12] |
| p12 | Gesture Detection → Synchronization | Optional episodes/frame references | Detector and fusion succeed | **partial; no active animation** [P12] |
| p13 | Synchronization → Context persistence | Intervention/context result | Accepted detection result | code-supported [P04, P06, P13] |
| p14 | Context persistence → SQL | Video/transcript/intervention rows | Current generation/lease | code-supported [P04, P30] |
| p15 | Context persistence → Preparation | Intervention/mode jobs | Context committed | code-supported [P04, P14] |
| p16 | API → Owned requests | Authenticated intent/session/progress | Private request | code-supported [P03, P05] |
| p17 | Owned requests → Preparation | Priority/retry | Context and owned target resolvable | code-supported [P05, P14] |
| p18 | Context persistence → Owned requests | Context-ready callback | Processing context available | code-supported [P01, P04, P05] |
| p19 | API → Preparation | Shared explain/prepare/retry/stream target | Valid target; admit or join | code-supported [P02, P14, P15] |
| p20 | Preparation → Target resolution | Claimed target/depth/ownership | Evidence consumer claim | code-supported [P14, P15] |
| p21 | Target resolution → Requested frame | Video source/time | `evidence_kind=auto` | code-supported [P15] |
| p22 | Requested frame → Image request | Requested JPEG | Acquisition succeeded | code-supported [P15–P17] |
| p23 | Requested frame → Transcript-only | Saved speech | Acquisition failed; context nonempty | code-supported [P15] |
| p24 | Target resolution → Transcript-only | Explicit target speech | Transcript kind; context nonempty | code-supported [P15] |
| p25 | Target resolution → Image request | Frame/category/semantics | Visual kind; no usable current snapshot | code-supported [P15–P17] |
| p26 | Image request → VLM | Bounded image/prompt/budget | Provider ready; accepted budget | code-supported [P17–P19] |
| p27 | VLM → Evidence assembly | Observations/finish metadata | Normal SnapshotEngine path; local GGUF has its own path | code-supported [P17, P20] |
| p28 | Assembly → Focused readings | Overview/eligible targets | Successful Modal overview with targets | code-supported [P17, P21] |
| p29 | Focused readings → Snapshot checkpoint | Updated evidence/conflicts | Bounded readings finished | code-supported [P16, P20, P21] |
| p30 | Assembly → Snapshot checkpoint | Snapshot or failure diagnostics | No refinement; diagnostics also persisted | code-supported [P16, P17, P20] |
| p31 | Target resolution → Snapshot checkpoint | Reused usable evidence | Current quality-versioned snapshot | code-supported [P16, P20, P23, P27] |
| p32 | Snapshot checkpoint → Aligned context | Usable evidence/time | Usability passes and ownership retained | code-supported [P14, P15, P23] |
| p33 | Files → Aligned context | Saved transcript | Text-stage context load | code-supported [P15, P22, P23] |
| p34 | Alignment → Coverage plan | Visual facts/aligned speech | Visual text path | code-supported [P13, P23] |
| p35 | Coverage → Synthesis inputs | Canonical facts, coverage/context | Grounded prompt preparation | code-supported [P23, P24] |
| p36 | Transcript-only → Synthesis inputs | Explicit speech-only context | Transcript-kind alternative | code-supported [P23, P24] |
| p37 | Inputs → Explanation LLM | Bounded prompt/depth/settings | No matching text checkpoint | code-supported [P23–P25, P27] |
| p38 | LLM → Text checkpoint | Completed accepted text | Complete/nonempty/validated result | code-supported [P23, P24, P27] |
| p39 | Inputs → Text checkpoint | Reused matching text | Current text fingerprint passes | code-supported [P23, P27] |
| p40 | Text checkpoint → TTS | Text/attempt | Missing or invalid final audio | code-supported [P14, P26, P28] |
| p41 | TTS → Audio artifacts | Checked PCM and final MP3 | Successful provider/encoding | code-supported [P26, P28] |
| p42 | Audio → Publication | Complete paths/text/provenance | Current valid artifact/ownership | code-supported [P14, P15, P26, P27] |
| p43 | Target resolution → Publication | Complete cached result | Current complete text and servable MP3 | code-supported [P15, P27] |
| p44 | Publication → SQL | Explanation/preparation metadata | Guarded short transaction | code-supported [P05, P14, P15, P30] |
| p45 | Publication → Delivery | Ready metadata | Client requests/polls persisted result | code-supported [P02, P14, P15] |
| p46 | Audio → Delivery | Current attempt NDJSON | Admitted active stream subscription | code-supported [P02, P28] |
| p47 | Delivery → Frontend | Status/text/audio/events | HTTP response; playback guards apply | code-supported [P02, P28, P29] |
| p48 | SQL → Delivery | Current status/text metadata | Query/poll/retrieval | code-supported [P02, P30] |
| p49 | Files → Delivery | Completed validated audio | Current cache and contained MP3 path | code-supported [P02, P15, P27] |
| p50 | Ingestion → Files | Transcript/directories | Orchestrated extraction persistence | code-supported [P06] |
| p51 | Keyframes → Files | JPEGs/manifest/metadata | Selection complete | code-supported [P11] |
| p52 | Snapshot checkpoint → Files | Snapshot JSON | Fresh guarded write; reused snapshot may stay unchanged | code-supported [P16, P23] |
| p53 | Text checkpoint → Files | Text/provenance | Atomic guarded write | code-supported [P23, P27] |
| p54 | Audio artifacts → Files | Stream/MP3/manifests | Current attempt/publication | code-supported [P26–P28] |
| p55 | Files → Target resolution | Candidate artifacts | Revalidate currentness/usability | code-supported [P15, P16, P20, P27] |
| p56 | Snapshot checkpoint → Lifecycle | Unusable-evidence failure | Saved evidence rejected | code-supported [P14–P16, P20] |
| p57 | LLM → Lifecycle | Text failure | Incomplete, empty or failed provider output | code-supported [P14, P24] |
| p58 | TTS → Lifecycle | Speech/attempt failure | Invalid or interrupted audio | code-supported [P14, P26, P28] |
| p59 | Preparation → Lifecycle | Lease/cancel/readiness state | Ownership invalid or dependency unavailable | code-supported [P14, P15] |
| p60 | Video jobs → Lifecycle | Context/generation failure | Processing/shutdown/cancellation error | code-supported [P04] |
| p61 | Lifecycle → Preparation | Eligible recovered work | Budget/readiness/lifecycle policy allows | code-supported [P14, P15] |
| p62 | Lifecycle → Video jobs | Eligible job resume/recovery | Current durable generation policy | code-supported [P04] |
| p63 | Lifecycle → Delivery | Failure/cancel/deferred status | Poll/stream notification | code-supported [P02, P14, P28] |
| p64 | Owned requests → Video jobs | Existing job resume/cancel | Cancelled job requested or no interested sessions | code-supported [P04, P05] |
| p65 | Video jobs → Preparation | Cached-context requested modes | Context cache valid; bypass detection | code-supported [P04] |
| p66 | Context persistence → Files | Interventions JSON | SQL context already persisted | code-supported [P04] |
| p67 | Target resolution → Lifecycle | Target/readiness/extraction error | Before usable evidence is established | code-supported [P14–P16] |
| p68 | Text checkpoint → Publication | Matching complete generation | Current input/text and valid final audio | code-supported [P23, P26, P27] |
| p69 | Selected local VLM to snapshot checkpoint | Local adapter snapshot | Local GGUF bypasses compact parser; usability still required | code-supported alternative; canonical success unverified [P16, P17, P19, P20] |

## 16. Architecture Diagram Specification

The JSON uses six grouped boundaries: request/durable coordination; lecture context extraction; visual understanding/evidence; context/text synthesis; speech/delivery; and storage. Their group IDs are `entry_coordination`, `multimodal_processing`, `visual_evidence`, `explanation_synthesis`, `speech_delivery` and `storage`. These are source/module boundaries, not claims of six independent deployed servers.

Render video jobs into ingestion, then **two parallel extraction streams**. The transcription stream chooses captions or Whisper; the frame stream performs decode → features → representative selection. They join at synchronization. Gesture Detection remains separately visible alongside those modules, but its optional scan occurs after extraction join; partial edges `p11`/`p12` do not activate as confirmed particles.

After synchronization, context persistence writes SQL/JSON, notifies owned requests and queues preparation. Preparation resolves a target into one of complete cache, reused evidence, new visual inference, requested-frame acquisition or explicit transcript-only context. Successful visual inference becomes canonical evidence, optionally passes through focused readings and reaches snapshot usability. Failed diagnostic snapshots must not continue to normal text animation.

Usable evidence joins saved transcript at aligned context, then coverage and bounded synthesis inputs. Choose LLM generation or matching text reuse, then speech or matching complete audio reuse. Current audio attempt streaming can run before complete-artifact publication. Complete text/audio metadata returns through API retrieval to accessible frontend output.

Use `flows` as directed subgraphs and `animationPhases` as **logical** staged activation. Fields identify branch alternatives, the extraction fork, synchronization merge, conditional cache routes, stage overlap and error-only scenarios. Providers are mutually selected, not all active nodes at once. Failed/deferred work must not animate as successful output. No coordinates, colors, animation speeds or measured durations are supplied.

The local GGUF alternative bypasses the ordinary compact parser/refinement path; the default visual sequence must be conditioned on the Modal/SnapshotEngine path. Its mere selection does not prove canonical evidence acceptance. Detailed pipeline nodes add source granularity without altering the existing system architecture exports. [P17, P19, P20]

## 17. Implementation Limitations

- All integrations are statically inspected; no model assets, network availability, inference success, output accuracy, latency or recovery execution was verified.
- Gesture Detection is partial and optional. The hand path is disabled in the orchestrator; no reliable semantic gesture/object interpretation is established. [P12]
- Whisper failure can be serialized as an empty transcript result rather than raised; the extraction join alone does not prove usable speech. The URL streaming implementation buffers all PCM before recognition. [P06, P09, P10]
- Semantic redundancy detection is not a hard keyframe rejection rule because scene coverage deliberately preserves representatives. Coverage targets are heuristic, not a guarantee that every important visual is retained. [P11]
- Initial moment matching and later single-teacher-segment lookup have different distance policies. Aligned context is bounded/gap-aware, but `_find_transcript_segment` can choose a distant nearest segment. Temporal association is not semantic proof. [P13, P22, P23]
- A valid canonical schema proves representation consistency, not correct OCR, mathematical symbols, connector direction or educational interpretation. Focused checks use the same model, not an independent truth oracle. [P20, P21]
- Default Modal request budgeting depends on native serving tokenization and matching context configuration. Serving definitions do not prove available GPUs, correct deployment, capacity or authentication. Local GGUF does not automatically inherit canonical/refinement parity. [P17–P19]
- Hallucination safeguards and provider-specific response review are mitigations, not perfect prevention. Structured remote checks do not universally apply to every local text response. [P24, P25]
- A partial stream is not a completed cached explanation. Midstream provider failure terminates the attempt; eligible retry/fallback is a separate lifecycle decision. [P26–P28]
- Initial video job completion and each explanation's readiness are separate. Completely unknown lectures require processing first; on-demand work can wait for context and owned interest. [P04, P05]
- The backend canonical evidence graph is not currently exposed as the frontend's structured-row contract. The accessible delivery trace concerns actual text/audio/status interfaces, not demo rows as extracted proof. [P02, P29]

## 18. Source Evidence

The companion JSON has a self-contained `evidenceIndex`. References below identify current local source functions/classes; no tests or older reports establish completion. Symbol references avoid invented line numbers.

| ID | Local files and symbols | Interpretation |
|---|---|---|
| P01 | `api/main.py`: `lifespan`, route mounting, context-ready wiring | Runtime ownership and manager integration |
| P02 | `api/routers/video.py`: processing/job/explain/status/retry/stream/audio handlers; `api/schemas.py` | Actual HTTP entry and output contracts |
| P03 | `api/routers/explanation_requests.py`; `api/auth.py:get_current_user` | Owned lecture/request boundary |
| P04 | `api/processing_jobs.py`: `ProcessingJobManager`, `_run_claimed`, `_schedule_modes`, `inspect_video_cache`, `persist_processing_result`; `api/resource_guard.py` | Durable context processing, cache and job recovery |
| P05 | `api/on_demand.py`: `OnDemandExplanations.request`, `_resolve`, `_context`, `_advance`, `source_ready`, `maintain`, `_cancel_uninterested` | Private intent around shared targets and existing jobs |
| P06 | `orchestrator/orchestrator.py`: `_ingest`, `_execute_parallel_extraction`, `_synchronize`, `process_detection_only` | Main extraction and initial synchronization ordering |
| P07 | `youtube_runtime.py`: `extract_youtube_video_id`, `youtube_runtime_options` | Source identity/media options |
| P08 | `transcription/lifecycle.py`; `transcription/process_runtime.py`: `_run_worker`, `TranscriptionProcessRuntime`; `worker_protocol.py` | Persistent transcription process and framed IPC |
| P09 | `transcription/transcriber/transcription_engine.py`: `TranscriptionEngine`, `TranscriptionResult`; `api_fetcher.py` in that directory | Captions-first selection, serialization and failed-result behavior |
| P10 | `transcription/transcriber/whisper_runner.py`: `WhisperRunner`, stream/file/download methods | Actual audio acquisition and speech-recognition fallback |
| P11 | `frame_extraction/pedagogical_extractor_v2.py`: decode, CLIP, classification, complexity, scenes, redundancy and temporal coverage functions; `frame_extraction/ffmpeg_runtime.py` | Pedagogical frame/feature path and source parameters |
| P12 | `synapse_interaction/detector.py`, `config.py`, `fusion.py`, `hand.py`; orchestrator interaction calls | Separate partial optional interaction module |
| P13 | `synchronizer/synchronizer.py`: `Synchronizer`, `extract_atomic_visual_facts`, `reconcile_visual_evidence`; `category_normalization.py` | Pre-VLM moment selection and post-VLM deterministic coverage |
| P14 | `api/explanation_preparation.py`: manager/workers/queues, leases, checkpoints, deferral/recovery/shutdown | Three-stage preparation and durable lifecycle |
| P15 | `api/explanation_service.py`: `prepare_visual_evidence`, `_load_target`, `_extract_requested_frame`, `prepare_explanation_text`, `generate_explanation_from_evidence`, cache/audio helpers | Responsible shared service and target/output validation |
| P16 | `orchestrator/orchestrator.py`: `extract_visual_evidence`, `_create_intervention_vlm_engine`, `_write_json_atomic` | Evidence cache/inference/checkpoint ownership |
| P17 | `vlm_engine/snapshot_engine.py`: active prompt, `analyze_frame`, parser, finish/truncation assessment and canonical attachment | Main VLM response handling and conditional refinement call |
| P18 | `vlm_interface/modal_vlm_interface.py`: adapter/image/budget/payload/retry methods; `vlm_interface/qwen_context_budget.py` | Actual remote image, native-token and transport boundaries |
| P19 | `modal_inference/config.py`, `app.py`; `vlm_engine/gguf_vlm_engine.py`, `image_preprocessor.py` | Source serving profile and separate local/alternate image paths |
| P20 | `visual_evidence/models.py`, `compact_schema.py`, `assembler.py`, `validation.py`, `usability.py` | Canonical schema, normalization, validity and usability gates |
| P21 | `vlm_engine/evidence_refinement.py`; `vlm_engine/region_grounding.py:uncovered_panels` | Bounded same-model detail checks and geometric proposals |
| P22 | `synthesizer/context_manager.py`: `get_aligned_context`, `get_context` | Active caption alignment versus older depth windows |
| P23 | `orchestrator/orchestrator.py`: `synthesize_intervention_text`, `_find_transcript_segment`, `_attach_transcript_coverage` | Text-stage alignment/coverage, cache hash and checkpoint sequence |
| P24 | `synthesizer/llm_synthesizer.py`: `weave`, `_build_task5_prompt`, payload selection, `_call_llm`, contract/source review, `explain_transcript`; `llm_interface/prompt_budget.py` | Grounded narration selection and response safeguards |
| P25 | `synthesizer/configuration.py`; `llm_interface/ollama_client.py`, `modal_mistral_provider.py`, `gemini_provider.py`; `modal_inference/mistral_config.py`; `orchestrator/ollama_service.py` | Provider selection, model identities and local lifecycle |
| P26 | `orchestrator/orchestrator.py:generate_intervention_audio`; `tts_engine/tts_engine.py`, `providers.py` | Speech generation, provider/fallback/encoding/resource behavior |
| P27 | `explanation_cache.py`: fingerprint/currentness/manifest/text-checkpoint functions | Context-independent evidence quality and generation cache provenance |
| P28 | `tts_engine/streaming.py`: `AudioAttempt`, `AudioStreams`, event journal; `api/routers/video.py`: stream/audio handlers | Attempt streaming versus complete file delivery |
| P29 | `synapse-web/src/api.js`; `src/lib/ttsStream.js`, `lectureRequests.js`; `src/components/Explanation.jsx`; `src/hooks/useLecturePlaybackGate.js` under `synapse-web/` | Actual client requests, text/audio consumption and playback gates |
| P30 | `api/database.py`, `api/models.py`, `api/migrations.py` | SQL state/metadata and schema preflight |
| P31 | `voice/routes.py:get_tts`, `speak`; `voice/piper_speaker.py` | Separate Piper voice-command reply path |
| P32 | `orchestrator/orchestrator.py`: `process_video`, `process_video_intervention_only`, `synthesize_intervention_explanation`, `generate_intervention_explanation` | Retained whole-workflow/compatibility methods, distinct from main job path |

This request created only `pipeline_architecture.md` and `pipeline_architecture.json`. Existing export files and application source were preserved.
