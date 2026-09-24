# NFFBuild Harness

Harness 的工作是阻止 drift，不是替 Product 做決策。

`npm run gate` 目前驗證：
1. forbidden shadow directory；
2. locked baseline immutability；
3. active baseline / Sprint binding；
4. task Acceptance/Test traceability；
5. Finding / Delta schema + escalation sanity。

GitHub Actions 在 PR 與 main push 執行相同 gate。

Fully automated：結構、immutable baseline、manifest、Sprint binding、traceability presence、ID duplicates 等。
Semi-automated：未來的 screenshot regression、responsive、accessibility、implementation↔spec drift report。
Human Gate：Product behavior、DESIGN_DELTA、Build Freeze/Rebaseline、material visual change、public/data/security/runtime contract change。

CI 能偵測違規；若要 server-side 阻止直接 merge，main 還應設定 PR required + Governance Gate required + CODEOWNERS review。
