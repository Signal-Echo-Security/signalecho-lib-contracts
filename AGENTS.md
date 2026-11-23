# Shared contracts guidance

- Follow the [hub guidance](https://github.com/Signal-Echo-Security/hub-signalecho/blob/develop/AGENTS.md) and issue-to-develop workflow.
- Preserve stable error codes, module, localization key, safe interpolation arguments, category and safe details. Transport mappings and translations belong at the boundary.
- Keep locale parity with Harbor Lens and test direction and resolution. Keep browser- and server-specific dependencies out of this package.
