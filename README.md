# FPL Assistant MCP

MCP server for Fantasy Premier League public data, designed to be registered in Composio Custom MCP.

Default Team ID: `4726413`

## What it exposes

- `get_team`
- `get_team_picks`
- `get_team_history`
- `get_team_transfers`
- `get_fpl_players`
- `get_fixtures`
- `get_gameweek_live`
- `get_player_summary`

## Run locally

Python 3.10+ is required.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

The MCP endpoint is:

```text
http://localhost:8000/mcp
```

## Deploy

Use any service that gives the app a public HTTPS URL (for example Render or Railway).

After deployment, the endpoint should look like:

```text
https://YOUR-DOMAIN/mcp
```

Use that full `/mcp` URL in Composio Custom MCP.

## Composio

According to Composio's current Custom MCP flow, first deploy the MCP server at a public HTTPS URL, then register the URL as a Custom MCP toolkit and sync its tools.

This server uses `NO_AUTH`, so no FPL password or account credentials are required for the public FPL data it reads.

## Important

This integration reads public FPL endpoints. It does not log into your FPL account and does not perform transfers or any account-changing action.
