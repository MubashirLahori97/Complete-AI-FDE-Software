# Mission 25: Change the system without losing trust

Stage 5: Establish quality and keep the product working

A rehearsed migration or dependency change with restoration evidence.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

A new visit field and a dependency update are needed. The running system contains useful records, permissions and deletion commitments that must survive the change.

## Understand the concepts

### Migrations, backups and restoration

A migration changes stored structure or data. A backup is a recoverable copy under a defined scope. Restoration is the act of rebuilding usable state from that copy. A backup is not proven usable until a relevant restore has been checked.

**Example:** Add an access-status field without silently converting unknown values into confirmed.

**Common wrong idea:** Reverting source code automatically reverses a data migration.

### Compatibility, privacy and retention

Dependency versions and data formats define compatibility. Privacy includes what is collected, who can access it, how long it is retained and how deletion reaches relevant copies. A restore plan must consider permissions and data commitments, not just row counts.

**Example:** A restored copy should not re-enable a deleted user's access.

**Common wrong idea:** A backup can be kept forever without any data responsibility.

## Predict, change, observe

Choose the prepared recovery evidence.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Backup file exists:** A copy exists; usability is unverified. The file may be incomplete, inaccessible or incompatible.
- **Restored and queried:** Relevant state can be read; check permissions and required journeys too. Restoration evidence should match what the product depends on.
- **Only code reverted:** Stored data and external effects may remain changed. Application history and data history are different boundaries.

Flow: Known state + recoverable copy (Test data / backup scope) → Rehearsed change (Migration or dependency update) → Verify + restore if needed (Application + data + permissions)

## Worked example

**before:** A migration maps every blank access value to confirmed.

**action:** Ask AI to rehearse on a copy, preserve unknown meaning, compare records and test restoration.

**after:** The new version preserves information meaning and has an observed recovery path.

**lesson:** Protect fictional test copies appropriately too. Never treat a production data change as disposable practice.

Authored example; your project requires its own observations.

## Project: A change with a recovery rehearsal

Use AI to perform a data migration or dependency update in a test copy. Verify required data, permissions and behaviour, and demonstrate restoration.

1. Record compatibility, data meaning, retention commitments and recovery scope before the change.
2. Create a suitable test copy and let AI rehearse the change and relevant checks.
3. Restore from the recovery copy, verify the main flow and record what the rehearsal does and does not establish.

## Outcome checks

- [ ] Important record counts, relationships and meanings are compared before and after.
- [ ] Required permissions and privacy/retention decisions survive or have an explicit migration policy.
- [ ] A restoration is actually demonstrated and the required user journey is verified afterwards.

Record starting state, action, expected result, observed result, environment and evidence location. Leave unrun checks unticked.

## System explanation

1. Purpose and success
2. Actual technologies
3. How the parts fit
4. Choices and alternatives
5. Where it runs
6. One action, end to end
7. Information, access and AI
8. Changes and failures

Explain the actual project; mark absent components as absent. Use your own words and a diagram where useful. Update after meaningful changes.

## Understanding, separately from output

- **explain:** Explain migration, backup, restoration and compatibility in your change.
- **locate:** Find the actual stored format, dependency version and recovery copy.
- **predict:** What if an older app reads the newly migrated data?
- **compare:** Compare rollback, forward correction and restoring a backup for this situation.
- **challenge:** AI says a backup's filename proves recoverability. What demonstration is needed?

## Reviewer guidance

Ask about a missing record, revoked permission or incompatible reader after recovery; check the explanation concerns the actual system.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A restored copy contains a previously deleted account. Revise recovery handling.
- The new dependency changes a default used by the API. Investigate compatibility.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 6](../../06_Day_Files_Errors_Debugging/README.md)
- [Original workshop 8](../../08_Day_Git_GitHub/README.md)
- [Original workshop 10](../../10_Day_Environments_Packages/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)
- [Original workshop 29](../../29_Day_Capstone_Part2/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
