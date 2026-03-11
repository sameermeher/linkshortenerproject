---
name: links-monthly-chart
description: >
  Generates a PNG bar chart showing the number of links created per month over
  the past 12 months, by querying the project's PostgreSQL database directly
  via the DATABASE_URL in .env.local (or .env). Use this skill whenever the
  user asks to visualise, chart, plot, or report on link creation trends,
  monthly stats, link history, or "how many links were created" — even if they
  don't say "chart" or "bar chart" explicitly.
---

# Links Monthly Chart Skill

This skill runs a Python script that connects directly to the project's
PostgreSQL database, counts links created in each of the past 12 months, and
produces a labelled bar-chart PNG.

---

## Prerequisites

Python 3.10+ and the following packages must be installed:

```
psycopg2-binary
matplotlib
python-dotenv
python-dateutil
```

Install them with:

```bash
pip install psycopg2-binary matplotlib python-dotenv python-dateutil
```

---

## How to run the skill

The script lives at:

```
.agents/skills/links-monthly-chart/scripts/plot_links.py
```

### Basic usage (saves `links_monthly_chart.png` in the current directory)

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py
```

### Custom output path

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py \
  --output /path/to/output.png
```

### Explicit env file

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py \
  --env /path/to/.env.local
```

---

## What the script does

1. **Loads environment variables** — tries `.env.local` first (Next.js
   convention), then `.env`, searching from the project root directory.
2. **Reads `DATABASE_URL`** — the Neon/PostgreSQL connection string used by
   Drizzle ORM in `db/index.js`.
3. **Queries the `links` table** — counts rows grouped by calendar month for
   the 12-month window ending with the current month.  Months with zero
   links are still shown so the x-axis is always a full continuous 12-month
   span.
4. **Plots a bar chart** — each bar represents one month; bar tops are
   annotated with the exact count.
5. **Saves a PNG** at the requested output path (default:
   `links_monthly_chart.png` in the working directory).

---

## Workflow for the agent

When a user asks for the monthly link chart, do the following:

1. **Check dependencies** — if any of the packages above aren't installed,
   install them first (`pip install ...`).
2. **Run the script** from the project root:
   ```bash
   cd /path/to/project && \
   python .agents/skills/links-monthly-chart/scripts/plot_links.py \
     --output links_monthly_chart.png
   ```
3. **Confirm the output** — tell the user the chart has been saved and provide
   the absolute path so they can open it.
4. **If DATABASE_URL is missing** — remind the user to add it to `.env.local`
   in the project root.  The value is the same connection string used by the
   app (`drizzle.config.ts` / `db/index.js`).

---

## Troubleshooting

| Error | Fix |
|---|---|
| `DATABASE_URL environment variable is not set` | Add `DATABASE_URL=<connection-string>` to `.env.local` |
| `psycopg2.OperationalError` | Check the connection string is valid and the database is reachable |
| `ModuleNotFoundError` | Run `pip install psycopg2-binary matplotlib python-dotenv python-dateutil` |
| Empty or all-zero chart | No links exist in the database yet — try inserting some test data |
