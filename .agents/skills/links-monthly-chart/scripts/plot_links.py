#!/usr/bin/env python3
"""
Plot a bar chart of links created per month over the past 12 months.

Usage:
    python plot_links.py [--output OUTPUT_PATH] [--env ENV_FILE]

Requires:
    pip install psycopg2-binary matplotlib python-dotenv
"""
import argparse
import os
import sys
from datetime import datetime, timezone

# Load .env.local or .env before anything else
from dotenv import load_dotenv

def load_env(env_path: str | None = None):
    """Try .env.local first (Next.js convention), then .env."""
    if env_path:
        if not load_dotenv(env_path):
            print(f"Warning: could not load env file at {env_path}", file=sys.stderr)
        return

    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    for candidate in [".env.local", ".env"]:
        path = os.path.join(project_root, candidate)
        if os.path.exists(path):
            load_dotenv(path)
            return

    # Fall back to searching from cwd
    for candidate in [".env.local", ".env"]:
        if os.path.exists(candidate):
            load_dotenv(candidate)
            return


def fetch_monthly_counts(database_url: str) -> list[tuple[str, int]]:
    """
    Query the links table and return (month_label, count) for each of the
    past 12 months (oldest first).
    """
    import psycopg2

    sql = """
        SELECT
            TO_CHAR(DATE_TRUNC('month', created_at AT TIME ZONE 'UTC'), 'Mon YYYY') AS month_label,
            DATE_TRUNC('month', created_at AT TIME ZONE 'UTC')                       AS month_start,
            COUNT(*)                                                                  AS total
        FROM links
        WHERE created_at >= DATE_TRUNC('month', NOW() AT TIME ZONE 'UTC') - INTERVAL '11 months'
        GROUP BY month_start, month_label
        ORDER BY month_start ASC;
    """

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    finally:
        conn.close()

    # Build a full 12-month spine so months with 0 links still appear
    from dateutil.relativedelta import relativedelta

    now = datetime.now(tz=timezone.utc)
    spine: dict[str, int] = {}
    for i in range(11, -1, -1):
        month_dt = (now - relativedelta(months=i)).replace(day=1)
        label = month_dt.strftime("%b %Y")
        spine[label] = 0

    for month_label, _month_start, total in rows:
        if month_label in spine:
            spine[month_label] = int(total)

    return list(spine.items())


def plot(data: list[tuple[str, int]], output_path: str) -> None:
    import matplotlib
    matplotlib.use("Agg")  # non-interactive backend — works without a display
    import matplotlib.pyplot as plt

    labels = [item[0] for item in data]
    counts = [item[1] for item in data]

    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(labels, counts, color="#4f46e5", edgecolor="white", linewidth=0.8)

    # Annotate bar tops
    for bar, count in zip(bars, counts):
        if count > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(counts) * 0.01,
                str(count),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#374151",
            )

    ax.set_xlabel("Month", fontsize=12, labelpad=8)
    ax.set_ylabel("Links Created", fontsize=12, labelpad=8)
    ax.set_title("Links Created — Past 12 Months", fontsize=14, fontweight="bold", pad=14)
    ax.yaxis.get_major_locator().set_params(integer=True)
    ax.set_ylim(0, max(counts) * 1.15 if max(counts) > 0 else 10)
    ax.spines[["top", "right"]].set_visible(False)
    plt.xticks(rotation=30, ha="right", fontsize=9)
    plt.tight_layout()

    fig.savefig(output_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Chart saved to: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot monthly link creation chart.")
    parser.add_argument(
        "--output",
        default="links_monthly_chart.png",
        help="Output PNG file path (default: links_monthly_chart.png)",
    )
    parser.add_argument(
        "--env",
        default=None,
        help="Path to .env file (default: auto-detect .env.local or .env in project root)",
    )
    args = parser.parse_args()

    load_env(args.env)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print(
            "Error: DATABASE_URL environment variable is not set.\n"
            "Make sure your .env.local (or .env) file contains DATABASE_URL.",
            file=sys.stderr,
        )
        sys.exit(1)

    print("Fetching link counts from database...")
    data = fetch_monthly_counts(database_url)

    total = sum(c for _, c in data)
    print(f"Found {total} links across the past 12 months.")

    plot(data, args.output)


if __name__ == "__main__":
    main()
