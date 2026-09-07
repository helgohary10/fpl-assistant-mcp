import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

const DEFAULT_TEAM_ID = 4726413;
const FPL_BASE = "https://fantasy.premierleague.com/api";

async function fpl(path) {
  const response = await fetch(`${FPL_BASE}${path}`, {
    headers: {
      "User-Agent": "FPL-Assistant-MCP/1.0",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`FPL API error ${response.status} for ${path}`);
  }

  return response.json();
}

function textResult(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
}

function createServer() {
  const server = new McpServer({
    name: "FPL Assistant",
    version: "1.0.0",
  });

  server.registerTool(
    "get_team",
    {
      description: "Get the public summary for an FPL team. Defaults to team 4726413.",
      inputSchema: {
        team_id: z.number().int().positive().optional(),
      },
    },
    async ({ team_id }) => textResult(await fpl(`/entry/${team_id ?? DEFAULT_TEAM_ID}/`))
  );

  server.registerTool(
    "get_team_picks",
    {
      description: "Get squad picks, captain, vice captain and multipliers for a team's gameweek. Defaults to team 4726413.",
      inputSchema: {
        gameweek: z.number().int().min(1).max(40),
        team_id: z.number().int().positive().optional(),
      },
    },
    async ({ gameweek, team_id }) =>
      textResult(await fpl(`/entry/${team_id ?? DEFAULT_TEAM_ID}/event/${gameweek}/picks/`))
  );

  server.registerTool(
    "get_team_history",
    {
      description: "Get season history and chip usage for an FPL team. Defaults to team 4726413.",
      inputSchema: {
        team_id: z.number().int().positive().optional(),
      },
    },
    async ({ team_id }) => textResult(await fpl(`/entry/${team_id ?? DEFAULT_TEAM_ID}/history/`))
  );

  server.registerTool(
    "get_team_transfers",
    {
      description: "Get transfer history for an FPL team. Defaults to team 4726413.",
      inputSchema: {
        team_id: z.number().int().positive().optional(),
      },
    },
    async ({ team_id }) => textResult(await fpl(`/entry/${team_id ?? DEFAULT_TEAM_ID}/transfers/`))
  );

  server.registerTool(
    "get_fpl_players",
    {
      description: "Get current FPL player, club, position, price and performance data.",
      inputSchema: {},
    },
    async () => textResult(await fpl("/bootstrap-static/"))
  );

  server.registerTool(
    "get_fixtures",
    {
      description: "Get current FPL fixtures and fixture difficulty information.",
      inputSchema: {},
    },
    async () => textResult(await fpl("/fixtures/"))
  );

  server.registerTool(
    "get_gameweek_live",
    {
      description: "Get live player statistics and points for a specific gameweek.",
      inputSchema: {
        gameweek: z.number().int().min(1).max(40),
      },
    },
    async ({ gameweek }) => textResult(await fpl(`/event/${gameweek}/live/`))
  );

  server.registerTool(
    "get_player_summary",
    {
      description: "Get detailed history and remaining fixtures for an FPL player.",
      inputSchema: {
        player_id: z.number().int().positive(),
      },
    },
    async ({ player_id }) => textResult(await fpl(`/element-summary/${player_id}/`))
  );

  return server;
}

export default {
  fetch(request, env, ctx) {
    return createMcpHandler(createServer)(request, env, ctx);
  },
};
