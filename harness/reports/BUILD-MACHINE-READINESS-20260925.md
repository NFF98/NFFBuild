# NFFBuild Build Machine Readiness — 2026-09-25

> **READINESS RECORD — NON-PRODUCT TRUTH**  
> 本文件記錄 NFFBuild 開發機器的可用狀態，不定義任何 NodeFF 產品需求、功能、UX、Contract 或 Build Spec 內容。

## Readiness Status

- `CURSOR_AUTOMATION_SAFE = PASS`
- `OPERATING_E2E = PASS`
- `STATUS = READY_FOR_FIRST_REAL_BUILD_SPEC`

## Clean Input State

- Active Build Spec: `null`
- Implementation enabled: `false`
- Active Sprint: `null`
- Active Task: `null`
- Backlog: `HOLD / empty`
- Active Release: `null / HOLD`
- Fake delivery data persisted: `0`

此狀態代表 NFFBuild 已完成治理、Harness、CI/CD 邊界與完整 Fake Sprint E2E 驗證，現在可作為乾淨的新 Build Machine 接收第一份正式、經批准的 Build Spec。

## Operating Boundary

`NFF98/NodeFF/working/` 仍是產品 Design Current Truth。

NFFBuild 不接受未經產品治理的 raw demand 直接成為 implementation truth。正式輸入順序為：

`NodeFF Working → User approval → Build Freeze → immutable BS-* → Backlog → approved Sprint → Cursor implementation → Test/Evidence → Release`

Implementation bug 若不改變產品契約，可留在 NFFBuild Fast Loop；任何 contract / UX / product semantics 變更都必須回到 NodeFF Working 經人工治理後再 Rebaseline。

## Evidence

- Fake Sprint E2E report: `harness/reports/FAKE-SPRINT-E2E-20260925.md`
- Governance Attack Dry-run after HF-E2E-001 fix: `28/28 PASS`
- Required GitHub checks:
  - `ci`
  - `attack`
  - `governance`
  - `Analyze JavaScript / TypeScript`
- Ruleset: active, pull request required, conversation resolution required, squash-only merge, no bypass.

## Baseline

Readiness verified from `main` commit:

`895b7dea8185280826e7ca07c6b91f56bebb1298`

下一個產品狀態改變只能由第一份正式 Build Spec Freeze 開始；在此之前，NFFBuild 應保持目前乾淨 HOLD 狀態。
