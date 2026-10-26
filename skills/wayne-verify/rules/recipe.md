# Build the repo's verification recipe

Once per repo, write down how an agent starts the app, checks it, drives it, captures evidence and cleans up, then prove the recipe by running it. Every later claim of green or proven goes through it.

## When

`.wayne/verify/` does not exist. Its launch or doctor step no longer works. The app gained a new surface the recipe cannot drive.

## Do

1. Find out from the code, not the user. Ask only what you cannot observe.
   - **Surface.** What a user touches: web UI, CLI, API, desktop or mobile app, library.
   - **Run.** The repo's own dev command, ports, environment variables, seed data, credentials.
   - **Drive.** Existing harnesses first (end-to-end specs, scripts, endpoints), then a generic one: a browser for web, a PTY or tmux for CLIs, HTTP for services.
   - **Observe.** Screenshots, terminal output, response bodies, logs, exit codes, stored state.
   - **Isolate.** A separate port, data directory or profile, so you never drive the user's own instance or data.
2. If the checkout does not build or start, fix that first or report exactly why.
3. Create `.wayne/verify/` and add `.wayne/` to `.git/info/exclude` unless the repo is yours and you choose to commit it.
4. Write `.wayne/verify/recipe.md` with five sections, each from what step 1 found, no placeholders:
   - **Green.** The exact fast-check commands.
   - **Launch.** The command that starts an isolated instance, how to tell it is ready, and how to stop it.
   - **Doctor.** One read-only check that this instance is ours, up and the right build. Run it before driving and after anything surprising.
   - **Drive.** The commands that act on the app, using stable handles: labels, routes, prompt strings, not coordinates.
   - **Evidence and cleanup.** What to capture and where it is kept. Cleanup stops what you started, never kills by process name, and never deletes the evidence.
5. Put shared helpers in `.wayne/verify/scripts/`. Prefer one control script that every feature calls for launch, doctor, drive and capture. Every script is executable and its usage appears in `recipe.md`.
6. Run the recipe end to end once: green, launch, doctor, drive one real path, capture, clean up, then confirm the evidence still exists. A recipe never executed is a draft.

## Example

Bad. "Start the server and check the page loads." No command, no port, no way to tell it is ready, no isolation from the user's running app.

Good. `scripts/verify up` starts the backend on port 8792 with a copy of the library in `/tmp/verify-<run>`, waits for its ready log line, and prints a session URL. `scripts/verify doctor` confirms the port belongs to that process. `scripts/verify down` stops only that process.

## Check

`recipe.md` names every script in `scripts/`, and running its steps from a fresh shell succeeds.
