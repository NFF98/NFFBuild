# Delivery Operating Model

本目錄控制 Cursor 實際開發，但不定義產品真相。

```text
Locked Build Spec
→ Sprint Plan
→ Task
→ Implement
→ Test
→ Review
→ Gate Report
→ Close
```

問題先 Detect → Finding quarantine → Classify。

- IMPLEMENTATION_BUG → fix code → test → verify
- TEST_BUG → fix test/harness → verify
- SPEC_AMBIGUITY → BLOCK task → human gate
- DESIGN_DELTA_CANDIDATE → BLOCK task → human gate
- BUILD_BLOCKER → evidence + impact assessment

只有批准後的 DESIGN_DELTA 可以啟動 upstream Working change / Build Spec rebaseline。

同時間只允許一個 active Sprint。每個 task 必須綁定 active Build Spec、Acceptance ID、Test ID、scope 與 completion evidence。

Delta lifecycle：
`Detect → Record → Assess Owner → Fix/Approve → Test → Verify → Close`

Delta type：
DESIGN_DELTA / IMPLEMENTATION_DELTA / TEST_DELTA / DEBUG_FINDING / FIX_DELTA。
