# appf2-build Harness

Harness 的工作是阻止 drift，不是替 Product 做決策。

`npm run gate` 驗證：

1. forbidden shadow directory；
2. Freeze Audit PASS 的 pinned source commit 不可漂移；
3. Projection Map 結構、exact selector policy、source/output traceability；
4. locked baseline immutability；
5. baseline file inventory + SHA-256 aggregate integrity；
6. baseline 除 `projection-map.json` 外的每個檔案都必須由 Projection Map account for；
7. Acceptance registry count / stable IDs / active test mapping；
8. active baseline / Sprint / Task binding；
9. Task Acceptance/Test mapping 必須真的存在於 active baseline；
10. Task write-path allowlist；
11. Sprint BLOCKED 時禁止產品 code change；
12. Finding / Delta reference + escalation sanity；
13. 同 strategy 最多兩次失敗；
14. Build HOLD 時禁止 `src/` / `tests/` 產品 implementation。

Projection dry-run：

```bash
node harness/scripts/project-build-spec.mjs \
  --source-root ../appf2-design \
  --map ./candidate-projection-map.json \
  --dry-run
```

Dry-run 不寫檔。真正 write mode 必須另外提供新的 / 空的 `--output-root`；Projector 本身不會批准 Build Freeze，也不會修改 `build-spec/CURRENT.json`。

GitHub Actions 在 PR 與 `main` push 執行相同 Gate。

Harness 能偵測違規；要在 server-side 阻止 direct merge / push，正式 Build 前仍需 GitHub branch protection + required status check。
