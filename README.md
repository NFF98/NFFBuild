# NFFBuild

> NodeFastFun (NodeFF / NFF) 的 implementation / delivery repository。
>
> **本 Repo 不是 Product Design SSOT。**

## Authority Boundary

```text
NFF98/NodeFF/working/
= 唯一 Design Current Truth
        ↓ User Build Freeze Gate
NFFBuild/build-spec/baselines/BS-*/
= immutable Build Spec snapshot
        ↓ Sprint activation
NFFBuild/src + tests
= Cursor implementation
```

硬規則：

1. Cursor 不得自行發明產品行為。
2. Cursor 不得直接修改 NodeFF `working/`。
3. Cursor 不得修改已鎖定的 Build Spec baseline。
4. Build 不符預期時先建立 Finding，不直接改 Spec。
5. IMPLEMENTATION_BUG / TEST_BUG 可留在 implementation fast loop。
6. SPEC_AMBIGUITY / DESIGN_DELTA_CANDIDATE / BUILD_BLOCKER 必須 quarantine 受影響 task。
7. 真正 Design Delta 必須回 NodeFF Working → User approval → 新 Build Spec baseline。
8. 舊 baseline 永不 inplace edit，只能被新 baseline supersede。
9. Code / tests 永遠不能反向成為產品真相。
10. 一次只執行一個 active Sprint。

## Current Mode

```text
REPOSITORY_STATE = GOVERNANCE_READY
ACTIVE_BUILD_SPEC = NONE
ACTIVE_SPRINT = NONE
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
```

目前已建立安全開發骨架，但在第一個 Build Spec Freeze Gate 完成前，不得開始 NodeFF 產品 implementation。

## Cursor Start Here

1. `AGENTS.md`
2. `.cursor/rules/*.mdc`
3. `build-spec/CURRENT.json`
4. `delivery/CURRENT-SPRINT.json`
5. Active Sprint manifest
6. Active locked Build Spec
7. mapped Acceptance / tests

執行治理檢查：

```bash
npm run gate
```
