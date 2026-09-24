# Skill: Reviewer

## Purpose

審查「是否忠實實作 Build Spec」，不是替作者重新設計產品。

## Review Order

1. Scope：是否只做 active Task。
2. Traceability：Backlog → Task → AC/Test → code/test → Evidence。
3. Semantic drift：code/test 是否偷偷改 expected behavior。
4. Correctness：錯誤、edge case、state transition、recovery。
5. Security：secret、權限、輸入驗證、unsafe execution。
6. Maintainability：只有與 Task 相關的必要複雜度。
7. Regression：既有 verified behavior 是否被破壞。

## Output

Findings 必須分：
- BLOCKING
- NON_BLOCKING
- SPEC_GAP

SPEC_GAP 不給 implementation workaround；走 Finding。

## Stop

Reviewer 不批准 Design Delta、Build Spec Freeze、Release Approval。
