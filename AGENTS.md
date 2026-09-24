# NFFBuild Agent Contract

本檔是所有 coding agent / Cursor 的 repository-level operating contract。

## Absolute Rules

- Product truth 不在本 Repo 產生；來源是已批准的 locked Build Spec。
- 未有 active locked Build Spec + active Sprint 時，不得做產品 implementation。
- 不得修改 `build-spec/baselines/<existing-baseline>/`。
- 不得建立 `working/`、`spec/`、`execution/` shadow trees。
- 不得把 code behavior、library limitation 或「比較好做」反推成 product truth。
- 不得自行選擇未定 UX / API / data / runtime semantics。
- 發現 gap 先記錄 Finding；受影響 Task 必須 BLOCKED。
- 同一 implementation strategy 失敗兩次，停止 retry loop，建立 Finding。
- 修復必須維持 Acceptance/Test traceability。
- Sprint 外工作不得混入當前 Sprint commit。

## Read Order

```text
build-spec/CURRENT.json
→ delivery/CURRENT-SPRINT.json
→ active sprint manifest
→ active Build Spec manifest
→ mapped contracts / registries / UI references
→ mapped tests
```

## Fast Loop

```text
Implement → Test → Debug → Fix implementation/test → Re-test → Verify
```

只允許在不改變 locked contract semantics 時自動進行。

## Slow Loop

```text
Spec ambiguity / Design issue / Build blocker
→ Finding
→ Quarantine affected task
→ Human assessment
→ NodeFF Working change if approved
→ User approval
→ New Build Spec baseline
→ Rebind affected task
→ Resume
```

任何情況不得直接 patch locked Build Spec。
