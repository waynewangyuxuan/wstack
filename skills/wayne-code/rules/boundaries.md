# Guard the boundary, trust the inside

A boundary is where data enters or leaves a domain: a CLI, an HTTP route, a config file, a database, an external API, another module's public entry. Checks, error handling and tests belong there. Inside, code trusts its types and stays pure.

## When

Adding validation, error handling, parsing or a test. Wiring a framework, CLI, network call, storage or external service. Reaching for a nil check deep in a call chain.

## Do

1. At the boundary, parse raw input into domain types once, reject what is invalid, and map failures to the boundary's own error form (an exit code, an HTTP problem, a typed error).
2. Inside, take the parsed types and trust them. No re-validation, no defensive checks for states the types already rule out.
3. Keep business logic in pure functions with no framework in them. The shell around them is thin: read, call, write.
4. Expose domain concepts across the boundary, not its private representation. Don't leak wire, storage or framework types through a public entry.
5. Test through the boundary the way its users call it, and assert what they observe against a literal expected value. Test an inner pure function on its own only when it holds real logic.

## Example

Bad. A route passes the raw request body down three layers, and each layer checks for a missing field.

Good. The handler parses the query into an `OrderId` and calls `order_summary(store, order_id)`, which trusts its argument. Only the HTTP layer turns errors into problem responses. Tests call the route and assert on the JSON a client receives.

Questions to ask. Is this data crossing a boundary right now? If not, the check is redundant. Could this be a pure function the shell just calls? If yes, extract it.

## Check

A test suite whose cases go through public entries. A lint or grep that flags framework imports inside core modules, when the repo allows one.
