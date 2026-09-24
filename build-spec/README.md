# Build Spec

Cursor implementation 的唯一產品輸入區。

Build Spec 不是新的 Design SSOT；它是從 `NFF98/NodeFF/working/` 經 User 批准 Build Freeze Gate 產生的 immutable implementation snapshot。

```text
NodeFF Working Current Truth
→ consistency / delta / acceptance audit
→ User approval
→ Build Freeze
→ BS-P1-001 LOCKED
→ Sprint
```

一旦 baseline merge 到 main：禁止修改、刪除、補檔、或為了讓 implementation pass 而重寫 contract。

若批准的 Design Delta 改變 implementation truth：
```text
BS-P1-001 remains unchanged
→ upstream Working updated
→ User rebaseline approval
→ BS-P1-002 added
→ BS-P1-002 supersedes BS-P1-001
```

第一個 baseline 只有在 NodeFF Working authority 清理、Delta 清帳、Acceptance/Test 完整、Function/Shared/Registry/UI cross-check 與 User 明確批准後才能建立。
