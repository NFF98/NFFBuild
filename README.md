# NFFBuild

> NodeFastFun (NodeFF / NFF) implementation and delivery repository.
>
> **This repository is NOT the Product Design SSOT.**

## Authority Boundary

- Product / design Current Truth lives in `NFF98/NodeFF/working/`.
- Cursor implementation MUST use only an approved, locked Build Spec baseline imported into this repository.
- Cursor MUST NOT invent product behavior or silently change a Build Spec.
- Build findings are quarantined first; product/design changes must return to the NodeFF Working governance flow.
- A locked baseline is never edited in place. Approved changes create a new baseline that supersedes the previous one.

## Current Mode

```text
REPOSITORY_STATE = BOOTSTRAP
ACTIVE_BUILD_SPEC = NONE
ACTIVE_SPRINT = NONE
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
```

The repository governance, Sprint model, Harness gates, Finding/Delta controls, and Cursor rules are initialized in the next setup commit.
