#!/usr/bin/env python3
"""Exports data/atlas.json (the only input of the Atlas site) from a finished DSBM data project.

    python3 tools/export_atlas_data.py /path/to/dsbm_project [--out data/atlas.json]

The Atlas repository never crawls anything. It consumes this one versioned file (schema: docs/DATA_CONTRACT.md).
Only numbers are recomputed here when they are simple counts; every statistic comes from the project's 04_results/ files.
Needs: pandas, numpy. A band literally named "None"/"NaN" must stay text, hence keep_default_na=False.
"""
import argparse, csv, datetime as dt, json
from pathlib import Path
import pandas as pd

ap = argparse.ArgumentParser(); ap.add_argument("project"); ap.add_argument("--out", default=str(Path(__file__).resolve().parents[1] / "data" / "atlas.json"))
a = ap.parse_args(); P = Path(a.project); RAW, PROC, RES = P / "02_data/raw", P / "02_data/processed", P / "04_results"
NA = dict(keep_default_na=False, na_values=[""])
jl = lambda n: json.loads((RES / n).read_text(encoding="utf-8")); cs = lambda n: pd.read_csv(RES / n)
nn = lambda v, f=lambda x: x: None if pd.isna(v) else f(v)

cl = pd.read_csv(PROC / "dsbm_clean.csv", **NA); en = pd.read_csv(RAW / "dsbm_enriched.csv", **NA).set_index("ma_id")
names = pd.read_csv(RAW / "dsbm_pymetal.csv", **NA).set_index("ma_id").name.to_dict()   # keeps a band literally named "None"
disc = pd.read_csv(RAW / "dsbm_discography.csv", dtype={"album_id": str}, **NA); disc = disc[disc.album != "NO_RELEASES"]
det = pd.read_csv(RAW / "dsbm_album_details.csv", dtype={"album_id": str}, **NA).set_index("album_id")
cnt = cl.country_clean.value_counts()

# releases per band: [title, type, year, month, day, album_id, url]
rel = {}
for r in disc.itertuples():
    d = det.loc[r.album_id] if r.album_id and r.album_id in det.index else None
    yr = nn(d.year, int) if d is not None else nn(r.year, int)
    mo = nn(d.month, int) if d is not None else nn(r.month, int)
    dy = nn(d.day, int) if d is not None else None
    rel.setdefault(int(r.ma_id), []).append([r.album, (d.page_type if d is not None and isinstance(d.page_type, str) else r.type), yr, mo, dy, r.album_id or None, r.album_url or None])
for v in rel.values(): v.sort(key=lambda x: (x[2] or 9999, x[3] or 13, x[4] or 32))

bands = []
for r in cl.itertuples():
    e = en.loc[r.ma_id]; mid = int(r.ma_id)
    bands.append({"id": mid, "n": r.name if isinstance(r.name, str) and r.name else names.get(r.ma_id, "?"), "c": r.country_clean,
                  "y": nn(r.formed_year, int), "s": r.status_clean, "t": [] if pd.isna(r.themes) else [x.strip() for x in r.themes.split(",")],
                  "g": r.genres_detail, "l": nn(r.current_label), "p": bool(r.is_pure_dsbm), "loc": nn(e.location), "ya": nn(e.years_active),
                  "logo": nn(e.logo_url), "photo": nn(e.photo_url), "rel": rel.get(mid, [])})

reg = pd.read_csv(PROC / "regression_dataset.csv").set_index("country_clean")
countries = []
for r in csv.DictReader(open(Path(__file__).with_name("countries.csv"), encoding="utf-8")):
    g = reg.loc[r["country"]] if r["country"] in reg.index else None
    ok = lambda v: None if (v is None or pd.isna(v)) else round(float(v), 2)
    countries.append({"name": r["country"], "iso2": r["iso2"], "iso3": r["iso3"], "num": r["num"], "fa": r["fa"], "tile": [int(r["tile_x"]), int(r["tile_y"])],
                      "micro": [float(r["micro_lat"]), float(r["micro_lng"])] if r["micro_lat"] else None, "n": int(cnt.get(r["country"], 0)),
                      "pop": ok(g.population_m) if g is not None else None, "rate": ok(g.bands_per_million) if g is not None else None,
                      "temp": None if (g is None or g.temp_flag == "bad") else ok(g.avg_temp_c), "tflag": "" if (g is None or pd.isna(g.temp_flag)) else g.temp_flag,
                      "gdp": None if g is None or pd.isna(g.gdp_per_capita) else int(round(g.gdp_per_capita)), "net": ok(g.internet_pct) if g is not None else None})

yr = cl.dropna(subset=["formed_year"]).formed_year.astype(int).value_counts().sort_index()
rg = cs("robustness_grid.csv"); desc = jl("descriptive_summary.json"); sm = jl("seasonality_summary.json")
wk = cs("seasonality_weekday.csv"); wk0 = wk[wk.subset.str.contains("PRIMARY")].iloc[0]
tt = cs("theme_trends.csv"); themes = {t: [{"period": r.period, "pct": r.pct, "lo": r.ci_low, "hi": r.ci_high, "n": int(r.bands_with_any_theme)} for r in g.itertuples()] for t, g in tt.groupby("theme")}
dd = det[det.date_precision == "day"].reset_index().merge(disc.drop_duplicates("album_id")[["album_id", "ma_id", "album"]], on="album_id", how="left")
bn = {b["id"]: b["n"] for b in bands}
calendar = [[int(r.month), int(r.day), int(r.year), r.album, bn.get(int(r.ma_id)), int(r.ma_id), r.page_type] for r in dd.itertuples() if pd.notna(r.ma_id) and isinstance(r.album, str)]
out = {"schema": 1, "generated": dt.date.today().isoformat(),
       "meta": {"bands": len(cl), "countries": int(cl.country_clean.nunique()), "releases": int(len(disc)), "datedAlbums": int(len(det)), "firstYear": int(yr.index.min()), "peakYears": desc["peak_years"]},
       "years": {str(k): int(v) for k, v in yr.items()}, "countries": countries, "unplaced": {k: int(cnt.get(k, 0)) for k in ("International", "Unknown")}, "bands": bands,
       "stats": {"scatter": [{"c": c["name"], "n": c["n"], "t": c["temp"], "rate": c["rate"]} for c in countries if c["temp"] is not None and c["rate"] is not None],
                 "robustness": [{"spec": s.split("  [")[0], "coef": round(float(co), 4), "p": float(p), "n": int(n), "model": m} for s, co, p, n, m in zip(rg.spec, rg.temp_coef, rg.temp_p, rg.n, rg.model)],
                 "themes": themes, "themeTests": cs("theme_trend_tests.csv").to_dict("records"), "releaseTypes": cs("release_types_by_period.csv").to_dict("records"),
                 "weekday": {k: int(wk0[k]) for k in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}, "fridayPct": float(wk0.friday_share_pct),
                 "monthCounts": cs("seasonality_counts.csv").iloc[:, 2].tolist(), "season": {"interpretation": sm["interpretation"], "winter": sm["winter_hypothesis"]},
                 "survival": cs("longevity_km_summary.csv").to_dict("records"), "topPerCapita": desc["per_capita_top"]},
       "calendar": calendar}
def clean(o):  # NaN -> null (JSON has no NaN); numpy scalars -> python
    if isinstance(o, dict): return {k: clean(v) for k, v in o.items()}
    if isinstance(o, list): return [clean(v) for v in o]
    if hasattr(o, "item") and not isinstance(o, (str, bytes)): o = o.item()
    return None if isinstance(o, float) and o != o else o
out = clean(out)
Path(a.out).parent.mkdir(parents=True, exist_ok=True)
Path(a.out).write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":"), allow_nan=False), encoding="utf-8")
pub = Path(a.out).parents[1] / "public" / "data"; pub.mkdir(parents=True, exist_ok=True)   # files the browser downloads on demand
slim = [{"id": b["id"], "n": b["n"], "c": b["c"], "y": b["y"], "s": b["s"], "t": b["t"][:8], "p": b["p"], "r": len(b["rel"]), "logo": b["logo"]} for b in out["bands"]]
(pub / "bands.json").write_text(json.dumps(slim, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
(pub / "calendar.json").write_text(json.dumps(out["calendar"], ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("wrote", a.out, round(Path(a.out).stat().st_size / 1e6, 2), "MB;", len(bands), "bands,", sum(len(b["rel"]) for b in bands), "releases,", len(calendar), "dated")
