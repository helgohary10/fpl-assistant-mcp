import os
import httpx
from mcp.server.fastmcp import FastMCP

FPL_BASE = "https://fantasy.premierleague.com/api"
DEFAULT_TEAM_ID = int(os.getenv("FPL_TEAM_ID", "4726413"))

mcp = FastMCP(
    "FPL Assistant",
    instructions=(
        "Fantasy Premier League data server. "
        "Default team ID is 4726413 unless another team_id is explicitly supplied. "
        "Use the tools to retrieve current FPL data before making recommendations."
    ),
)

def get_json(path: str):
    url = f"{FPL_BASE}{path}"
    with httpx.Client(
        timeout=30.0,
        headers={
            "User-Agent": "Mozilla/5.0 FPL-Assistant/1.0",
            "Accept": "application/json",
        },
        follow_redirects=True,
    ) as client:
        r = client.get(url)
        r.raise_for_status()
        return r.json()

@mcp.tool()
def get_team(team_id: int = DEFAULT_TEAM_ID) -> dict:
    """Get the public summary for an FPL team."""
    return get_json(f"/entry/{team_id}/")

@mcp.tool()
def get_team_picks(gameweek: int, team_id: int = DEFAULT_TEAM_ID) -> dict:
    """Get the selected squad, captain, vice-captain and multipliers for a team in a gameweek."""
    return get_json(f"/entry/{team_id}/event/{gameweek}/picks/")

@mcp.tool()
def get_team_history(team_id: int = DEFAULT_TEAM_ID) -> dict:
    """Get season history and chip usage for an FPL team."""
    return get_json(f"/entry/{team_id}/history/")

@mcp.tool()
def get_team_transfers(team_id: int = DEFAULT_TEAM_ID) -> list:
    """Get the transfer history for an FPL team."""
    return get_json(f"/entry/{team_id}/transfers/")

@mcp.tool()
def get_fpl_players() -> dict:
    """Get current player, club, position, price and performance data from FPL."""
    return get_json("/bootstrap-static/")

@mcp.tool()
def get_fixtures() -> list:
    """Get current FPL fixtures and official fixture difficulty values."""
    return get_json("/fixtures/")

@mcp.tool()
def get_gameweek_live(gameweek: int) -> dict:
    """Get live player statistics and points for a specific gameweek."""
    return get_json(f"/event/{gameweek}/live/")

@mcp.tool()
def get_player_summary(player_id: int) -> dict:
    """Get detailed history and remaining fixtures for a specific FPL player."""
    return get_json(f"/element-summary/{player_id}/")

if __name__ == "__main__":
    # Streamable HTTP endpoint: /mcp
    mcp.run(transport="streamable-http")
