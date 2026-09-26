# Build Spec

Cursor implementation 的唯一產品輸入區。

Build Spec 不是新的 Design SSOT；它是從 `NFF98/appf2-design/working/` 經 Freeze Audit、版本鎖定、deterministic Projection 與 User 批准 Build Freeze Gate 產生的 immutable implementation snapshot。

```text
appf2 Working Current Truth
→ Phase Freeze Audit PASS
→ PIN exact Design commit（Version Lock）
→ deterministic Projection / dry-run
→ User approval
→ Build Freeze
→ BS-P1-001 LOCKED
→ Sprint / Implementation Activation
```

## Freeze Audit Version Lock

**FREEZE AUDIT PASS = Version Lock。**

Projection 與 Build Freeze 只能讀取該次 Audit PASS 的精確 Design commit。不得改讀較新的 `main`，也不得把 Audit 後的新變更順手混入同一 baseline。

若在 Projection / Freeze 前發現 material issue：

```text
REOPEN affected Freeze Audit
→ upstream Design fix
→ affected audit rerun
→ new PASS
→ pin new exact commit
→ restart Projection
```

非 material change 不插隊進當次 baseline，留待後續 Delta / Rebaseline。

## Projection Contract

每個 baseline 必須包含 `projection-map.json`。它是 provenance / extraction contract，不是第二份 Product SSOT。

Projection 只有三種模式：

- `FULL_COPY`：來源檔完整複製。
- `SECTION_FILTERED`：只按明確 Markdown heading 邊界抽取批准的 phase 內容。
- `REFERENCE_ONLY`：明確記錄為非 executable reference，不輸出 Build Spec 檔案。

`SECTION_FILTERED` 只允許 `EXACT_HEADING`；0 個或多於 1 個 heading match 都 FAIL。禁止 regex 猜測、fuzzy matching、LLM classification。

Projector 還會驗證：

- source checkout HEAD = pinned Freeze Audit commit；
- GitHub origin = `source_repo`；
- 每個 source file 的 Git blob SHA；
- 每個 projected output 的 SHA-256；
- source / target path 不可逃逸；
- write mode 只允許新的或空的 output directory。

## Required Baseline Shape

```text
build-spec/baselines/BS-P1-001/
├─ manifest.json
├─ projection-map.json
├─ functions/
├─ shared/
├─ UI-UX/
└─ registries/
   └─ acceptance-test-registry.json
```

`manifest.json` 必須 inventory baseline 內除 manifest 本身外的所有檔案，記錄每個 SHA-256，並提供 aggregate `content_sha256`。Harness 會重新計算，並要求除了 `projection-map.json` 外，每個 baseline 檔案都必須由 Projection Map account for，避免未經來源追蹤的檔案被塞進 Build Spec。

一旦 baseline merge 到 `main`：禁止修改、刪除、補檔、改 hash、或為了讓 implementation pass 而重寫 contract。

若批准的 Design Delta 改變 implementation truth：

```text
BS-P1-001 remains immutable
→ upstream Working updated
→ affected audit / approval complete
→ User rebaseline approval
→ BS-P1-002 added
→ BS-P1-002 supersedes BS-P1-001
```

Build Freeze 與 Implementation Activation 是兩個不同 Human Gate。Freeze 可以建立 locked baseline，但在 Sprint / Task / Acceptance-Test binding 尚未批准前，`implementation_enabled` 必須維持 `false`。
