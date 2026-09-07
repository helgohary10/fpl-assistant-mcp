# FPL Assistant MCP — Cloudflare

This is a stateless remote MCP server for Fantasy Premier League public data.

Default Team ID: `4726413`

MCP endpoint after deployment:

`https://YOUR-WORKER.workers.dev/mcp`

Tools:
- get_team
- get_team_picks
- get_team_history
- get_team_transfers
- get_fpl_players
- get_fixtures
- get_gameweek_live
- get_player_summary

No FPL password is required. The server reads public FPL API endpoints.

Deployment:
1. Push these files to GitHub.
2. In Cloudflare Workers & Pages, choose Continue with GitHub.
3. Select the repository.
4. Use `npm install` as build command if requested.
5. Use `npx wrangler deploy` as deploy command.
6. Deploy.
