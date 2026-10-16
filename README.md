# SessionScope

Inspect the checks that bind a session to its origin, lifetime, and authorized action.

**Field:** Application & product security  
**Relevant roles:** Application Security Engineer I · Software Engineer, Security  
**Status:** working prototype, published on GitHub and Vercel.

[**Open the live interactive lab**](https://sessionscope-roan.vercel.app/)

The hosted lab runs synthetic exercises in your browser. See the scope below for local integration exercises and limitations.

## Run

Requires Node.js 22 or newer. The core prototype has no npm dependencies.

```sh
npm test
npm run build
npm start
```

Open `http://127.0.0.1:8767`. Use `PORT=8770 npm start` for another port.
To run analysis without a browser:

```sh
npm run analyze
node run.mjs input.json
```

## Explore

1. Run the CSRF case with mismatched tokens. Then make them equal in the request JSON and rerun.
2. Choose expiry and move now to the expiration boundary. Equality must be rejected.
3. Run local HTTP tests for session rotation, CSRF enforcement, revocation, and signed-token validation.

## What is implemented

- A project-specific analysis engine shared by the browser and CLI.
- Guided controls plus editable/importable JSON input (maximum 1 MB).
- Computed decisions, supporting records, explicit empty/error states, and
  downloadable evidence containing the input and limitations.
- Self-hosted Newsreader headings and DM Sans text; 18px body text,
  16px supporting text, 15px technical labels, keyboard focus, reduced motion,
  and responsive evidence rows.
- Independent boundary and regression tests in `tests/`.

## Scope and limitations

The public view is a session-policy simulator, not an identity provider. The local server uses real random session IDs and signed tokens. External OIDC/SSO is not implemented.

All bundled identities, documents, logs, and advisories are fictional. Browser
inputs are visitor-controlled; this public demo is not a trusted security
boundary. Do not use it with private production data. Local enforcement or
provider runners, where provided, have their own documented setup and limits.
Do not report fixture outcomes as production results or live-model findings.

## Publish independently

This directory is a complete, separate GitHub/Vercel project. After creating a
repository, push this directory as its root. Import that repository in Vercel:
framework **Other**, build command **npm run build**, output **public**.
There are no required secrets for the public demo. Do not include `public/`,
`.env`, provider credentials, or actual investigation evidence in Git.

## Structure

- `web/engine.js`: domain-specific analysis and validation
- `web/runtime.js`: input validation, canonicalization, and hashing utilities
- `web/app.js`: accessible controls, result views, imports, and exports
- `tests/`: independently asserted security and behavior tests
- `docs/THREAT-MODEL.md`: trust boundaries and claims
- `scripts/`: optional local integrations, if applicable

## Validation

Run `npm test` for current results. Browser viewport checks and performance
metrics must be measured separately; passing engine tests does not establish
visual accessibility or production readiness.

Font notices are included in `web/fonts/`. Source code is MIT licensed.

## Local authenticated HTTP exercise

Run `npm run http-lab` in a second terminal. It listens only on
`127.0.0.1:8780`; it is not part of the public Vercel deployment.

POST `/login` with JSON `{"name":"alice","password":"DemoPass!2026"}`
and exact Origin `http://127.0.0.1:8780`. Retain the returned HttpOnly
`lab_session` cookie and the response's CSRF token. Send that cookie on
subsequent requests. Every POST also requires the exact Origin and
`X-CSRF-Token` header. Credentials are deliberately public lab credentials.

GET `/me` inspects the session. POST `/logout` revokes it. POST
`/reauthenticate` with the demo password rotates the session and CSRF token.
POST `/sensitive` requires authentication within the previous 120 seconds.
GET `/token` issues a local HMAC-signed token; POST `/verify-token` validates
its signature, fixed algorithm, issuer, audience, subject, and time claims.
This is not an OAuth/OIDC provider or a production JWT library.

The local server does not implement production TLS, persistent sessions,
external identity-provider login, or production password storage. Never deploy
this exercise server or enable vulnerable routes on a public host.
