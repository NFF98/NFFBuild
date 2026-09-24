# Harness Gate Matrix

| Area | Automation Level | Gate |
|---|---|---|
| Forbidden shadow SSOT directories | FULL AUTO | fail CI |
| Locked baseline file/hash integrity | FULL AUTO | fail CI |
| Old baseline mutation | FULL AUTO | fail CI |
| Acceptance ID/Test ID existence + duplicates | FULL AUTO | fail CI |
| Sprint ↔ Build Spec binding | FULL AUTO | fail CI |
| One active Task + write-path scope | FULL AUTO | fail CI |
| Finding/Delta schema + references | FULL AUTO | fail CI |
| Two-attempt retry ceiling | FULL AUTO | fail CI |
| Schema / contract tests | FULL AUTO after implementation | test gate |
| API deterministic tests | FULL AUTO after implementation | test gate |
| State-machine / Runtime semantics tests | FULL AUTO where deterministic | test gate |
| Regression suite | FULL AUTO where deterministic | test gate |
| Screenshot regression | SEMI AUTO | machine diff + human materiality review |
| Responsive checks | SEMI AUTO | automated viewport suite + human UX review |
| Accessibility | SEMI AUTO | automated checks + human review for material UX |
| Implementation ↔ Build Spec drift | SEMI AUTO | machine traceability + human semantic review |
| Product behavior choice | HUMAN ONLY | User / governance |
| DESIGN_DELTA approval | HUMAN ONLY | User |
| Build Spec Freeze / Rebaseline | HUMAN ONLY | User |
| Material visual change | HUMAN ONLY | User |
| Public API / Data / Security / Runtime contract change | HUMAN ONLY | User |
| Sprint Activation / Sprint Close | HUMAN GATE | User / governance |

原則：能 deterministically 判斷的交給 Harness；牽涉「產品應該怎麼做」的判斷永遠不交給 Cursor 自動決策。
