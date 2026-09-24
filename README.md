# NFFBuild

> NodeFastFun (NodeFF / NFF) implementation / delivery / release repository。
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
        ↓ CI / Sprint Close
NFFBuild/releases/
= approved Release Candidate
        ↓ automated staging + production pipeline
Cloudflare + Supabase
= deployed runtime
```

硬規則：

1. Cursor 不得自行發明產品行為。
2. Cursor 不得直接修改 NodeFF `working/`。
3. Cursor 不得修改已鎖定的 Build Spec baseline。
4. Build 不符預期時先建立 Finding，不直接改 Spec。
5. Code / tests 永遠不能反向成為產品真相。
6. 一次只執行一個 active Sprint / active Task。
7. Release 必須綁定 locked Build Spec、closed Sprint、source commit、User approval。
8. Release Manifest 不允許任意 shell command，只能使用受控 deployment target。
9. Production DB migration 只能 forward-compatible / expand-only；不得自動 destructive rollback。
10. Production deploy 失敗時，Cloudflare code target 可自動 rollback；DB 保持 forward-compatible。

## Current Mode

```text
REPOSITORY_STATE = GOVERNANCE_RELEASE_PIPELINE_READY
ACTIVE_BUILD_SPEC = NONE
ACTIVE_SPRINT = NONE
ACTIVE_RELEASE = NONE
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
PRODUCTION_RELEASE = HOLD
```

目前已建立 Build / Sprint / Harness / CI/CD / Release 安全骨架。在第一個 Build Spec Freeze Gate 與 Release Candidate 批准前，不會部署任何 NodeFF 產品。

## Cursor Start Here

1. `AGENTS.md`
2. `.cursor/rules/*.mdc`
3. `build-spec/CURRENT.json`
4. `delivery/CURRENT-SPRINT.json`
5. Active Sprint manifest
6. Active locked Build Spec
7. mapped Acceptance / tests

治理檢查：

```bash
npm run gate
npm run product:ci
```

Release：
- `releases/README.md`
- `deploy/README.md`
