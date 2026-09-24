# NFFBuild

> NodeFastFun (NodeFF / NFF) implementation / delivery / release repository。
>
> **本 Repo 不是 Product Design SSOT。**

## One-glance Development Flow

```text
NFF98/NodeFF/working/
= Design Current Truth
        ↓ User Build Freeze Gate
build-spec/baselines/BS-*/
= immutable Build Spec
        ↓ derive only
delivery/backlog/QUEUE.json
= approved executable work queue
        ↓ Sprint planning
delivery/sprints/SP-*/
= selected tasks + AC/Test mapping
        ↓ one Active Task
src/ + tests/
= implementation + verification
        ↓
delivery/evidence/
= test / command / review / artifact evidence
        ↓ Sprint Close Gate
releases/manifests/REL-*.json
        ↓
CI → Staging → Production → Smoke → Rollback
```

## Authority Boundary

- `NFF98/NodeFF/working/`：唯一 Design Current Truth。
- `build-spec/`：User 批准後的 immutable implementation snapshot。
- `delivery/backlog/`：只可從 active Build Spec 派生，不得創造新需求。
- `delivery/sprints/`：從 Backlog 選取、綁定 AC/Test 的執行單位。
- `src/` + `tests/`：Cursor implementation。
- `delivery/evidence/`：Task / Sprint verification evidence。
- `releases/`：批准後的 Release control artifact。

## Current Mode

```text
REPOSITORY_STATE = DEVELOPER_OPERATING_STRUCTURE_READY
ACTIVE_BUILD_SPEC = NONE
BACKLOG = HOLD
ACTIVE_SPRINT = NONE
ACTIVE_TASK = NONE
ACTIVE_RELEASE = NONE
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
PRODUCTION_RELEASE = HOLD
```

## Cursor Start Here

1. `AGENTS.md`
2. `.cursor/rules/*.mdc`
3. `build-spec/CURRENT.json`
4. `delivery/backlog/QUEUE.json`
5. `delivery/CURRENT-SPRINT.json`
6. Active Sprint / Task
7. Active Build Spec
8. mapped AC/Test
9. required Skill
10. Evidence requirements

```bash
npm run gate
npm run product:ci
```
