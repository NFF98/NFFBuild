# NFFBuild Operating Model

## 1. Authority

```text
NFF98/NodeFF/working/ = Design Current Truth
NFFBuild/build-spec/  = approved immutable implementation baseline
NFFBuild/delivery/    = execution control
NFFBuild/src + tests  = implementation result
```

Code、tests、Cursor opinion、library limitation 都不能反向覆蓋產品真相。

## 2. Build Enable Sequence

```text
NodeFF Working clean
→ Build Freeze audit
→ User approves baseline
→ BS-* LOCKED
→ Sprint planned from that baseline
→ User approves Sprint activation
→ exactly one Active Task
→ Cursor automation enabled for that Task only
```

沒有 locked baseline、active Sprint 或 active Task 任一項，產品 implementation = HOLD。

## 3. Sprint Lifecycle

```text
PLANNED → ACTIVE → BLOCKED | REVIEW → CLOSED
```

- `PLANNED`：未開工。
- `ACTIVE`：只有 `active_task` 可被執行。
- `BLOCKED`：停止 `src/` / `tests/` 產品變更；允許 Finding / governance resolution。
- `REVIEW`：只允許與 active Task scope 有關的修正、測試、證據。
- `CLOSED`：Gate report 完成且無 blocking Finding。

## 4. Task Contract

每個 Task 必須固定：

- Build Spec ID
- Acceptance ID ↔ Test ID mapping
- `allowed_write_paths`
- required verification commands
- scope / non-scope
- `product_decision_allowed = false`

Task 需要修改 allowlist 以外的檔案時，不得自行擴張；先建立 Finding。

## 5. Fast Loop — Cursor 可自動處理

```text
IMPLEMENTATION_BUG / TEST_BUG
→ fix without changing contract semantics
→ mapped tests
→ required commands
→ evidence
→ verify
```

同一 implementation strategy 最多失敗兩次；第三次以前必須停止 retry，留下 Finding。

## 6. Slow Loop — Human Governance

```text
SPEC_AMBIGUITY / DESIGN_DELTA_CANDIDATE / contract-affecting BUILD_BLOCKER
→ Task BLOCKED
→ Sprint BLOCKED when active task affected
→ Finding evidence
→ Human classification
→ DESIGN_DELTA if needed
→ NodeFF Working update
→ User approval
→ new BS-* baseline
→ rebind affected Task
→ explicit resume
```

舊 Build Spec 永遠不 inplace edit。

## 7. Delta Ownership

| Type | Meaning | Contract semantics | Default owner | Build Spec impact |
|---|---|---|---|---|
| DESIGN_DELTA | Product / UX / API / Data / Runtime contract 要改 | MAY CHANGE | Human Governance | May require rebaseline |
| IMPLEMENTATION_DELTA | internal implementation plan changed | MUST NOT CHANGE | Cursor | No |
| TEST_DELTA | test mechanics / harness correction | MUST NOT CHANGE | Cursor/Human | No |
| DEBUG_FINDING | diagnostic discovery / evidence | MUST NOT CHANGE | Cursor | No |
| FIX_DELTA | bounded defect fix | MUST NOT CHANGE | Cursor | No |

只要非 DESIGN_DELTA 需要改 expected product behavior，就分類錯誤，必須升級成 Design path。

## 8. Rebaseline

```text
BS-P1-001 LOCKED
→ Design Delta approved upstream
→ affected Sprint BLOCKED
→ BS-P1-002 created from approved Working commit
→ manifest.supersedes = BS-P1-001
→ content + Acceptance validation
→ User approves activation
→ affected tasks rebind
→ resume
```

## 9. Sprint Close

Sprint 不因 build 成功自動 CLOSED。Close Gate 至少需要：

- all required Tasks VERIFIED/CLOSED;
- mapped Acceptance/Test complete;
- regression gate pass;
- no blocking Finding / unresolved Design Delta;
- Gate report references implementation commit and baseline;
- Human Sprint Close Gate approval。
