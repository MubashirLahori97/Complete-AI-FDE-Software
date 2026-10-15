# Mission 22: Release with a way back

Stage 5: Establish quality and keep the product working

A documented release and a demonstrated recovery in an appropriate environment.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The app works locally but the release uses different configuration. Plan delivery and recovery together so a failed change does not become a guess under pressure.

## Understand the concepts

### Version history, builds and environments

Version history records changes and a known starting point. A build turns source and dependencies into runnable output. An environment supplies configuration, services and access. A working local setup may differ from the deployed one in any of these.

**Example:** A release points to a specific revision and dependency configuration.

**Common wrong idea:** The latest files on a laptop identify exactly what users are running.

### CI/CD, rollback and state

Continuous integration checks changes; delivery/deployment pipelines prepare or release them. Rollback restores a suitable previous application version. Stored data may need a separate restoration or compatible migration plan; reverting code does not undo every external action.

**Example:** An older release must still understand the current data schema before it is a safe rollback.

**Common wrong idea:** A green pipeline proves production is healthy.

## Predict, change, observe

Change the release situation in this prepared model.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Build passes, secret absent:** Release can still fail at runtime configuration. Build success does not supply a missing server credential.
- **Code-only regression:** A compatible previous release may restore the journey. Verify the actual result after rollback.
- **Incompatible data migration:** Code rollback alone may be unsafe or insufficient. Stored-state compatibility needs its own recovery plan.

Flow: Known revision + checks (Version control / CI) → Build + configure + release (Delivery environment) → Verify or recover (User journey + operations)

## Worked example

**before:** Deploy whatever is in the current folder.

**action:** Ask AI to release an identified revision with environment checks, smoke tests and a compatible recovery target.

**after:** A failed test release can return to a known working journey.

**lesson:** Demonstrate recovery in a test environment first. Record exact commands or provider actions through AI-generated instructions you can explain.

Authored example; your project requires its own observations.

## Project: A release you can recover

Release the product to a suitable test or authorized public environment with identified source, configuration and a recovery procedure.

1. Ask AI to inspect the current stack, prepare reproducible build/release instructions and name required configuration without secrets.
2. Release a known revision and verify its main user journey from the deployed environment.
3. Introduce a reversible test failure, recover, and verify both application behaviour and required data.

## Outcome checks

- [ ] The running release is tied to an identified revision, build and environment.
- [ ] An actual deployed user journey is observed separately from pipeline success.
- [ ] A recovery demonstration restores required behaviour and accounts for stored-state compatibility.

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

- **explain:** Explain source, build, configuration, deployment and rollback in this release.
- **locate:** Identify the running version and where required configuration is supplied.
- **predict:** What might fail when local dependencies differ from the release environment?
- **compare:** Compare reverting code with restoring data and reconciling external effects.
- **challenge:** AI says the green pipeline proves the site works for users. What observation is missing?

## Reviewer guidance

Change one environment variable or version in a test scenario and ask for a bounded investigation and recovery.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The previous code cannot read the new schema. Revise recovery.
- The build succeeds but a server configuration value is missing. Trace the failure.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 8](../../08_Day_Git_GitHub/README.md)
- [Original workshop 10](../../10_Day_Environments_Packages/README.md)
- [Original workshop 14](../../14_Day_Project2_Deployed_Web_App/README.md)
- [Original workshop 29](../../29_Day_Capstone_Part2/README.md)
- [Original workshop 30](../../30_Day_Ship_It/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
