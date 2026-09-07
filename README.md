# FPL Assistant MCP

Cloudflare Worker + MCP server for public Fantasy Premier League data.

Default Team ID: 4726413

MCP endpoint after deployment:
https://YOUR-WORKER.workers.dev/mcp

Tools:
- get_team
- get_team_picks
- get_team_history
- get_team_transfers
- get_fpl_players
- get_fixtures
- get_gameweek_live
- get_player_summary

This version follows Cloudflare's current stateless MCP example and uses
`createMcpHandler` directly from `@modelcontextprotocol/server`.
