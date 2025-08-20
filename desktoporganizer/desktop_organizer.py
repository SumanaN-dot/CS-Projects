#!/usr/bin/env python3
import argparse
import json
import os
import re
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

# ----------------------
# Default rules by folder
# ----------------------
DEFAULT_RULES = {
    "Images": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp", ".heic", ".svg", ".ico"],
    "Documents": [".doc", ".docx", ".rtf", ".txt", ".md", ".odt", ".rtfd"],
    "PDFs": [".pdf"],
    "Spreadsheets": [".xls", ".xlsx", ".csv", ".ods", ".tsv", ".numbers"],
    "Presentations": [".ppt", ".pptx", ".key", ".odp"],
    "Code": [".py", ".js", ".ts", ".java", ".c", ".cpp", ".h", ".hpp", ".cs", ".rb", ".php", ".go", ".rs", ".swift", ".kt", ".m", ".sh", ".ps1", ".sql", ".json", ".yaml", ".yml", ".xml", ".ipynb"],
    "Audio": [".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".aiff"],
    "Video": [".mp4", ".mov", ".mkv", ".avi", ".wmv", ".flv", ".webm"],
    "Archives": [".zip", ".tar", ".gz", ".bz2", ".xz", ".rar", ".7z"],
    "Installers": [".exe", ".msi", ".pkg", ".dmg", ".deb", ".rpm"],
    "Shortcuts": [".lnk", ".url", ".webloc"],
    "Design": [".psd", ".ai", ".eps", ".indd", ".fig", ".sketch"],
    "Fonts": [".ttf", ".otf", ".woff", ".woff2"]
}
MISC_FOLDER = "Misc"

def find_desktop() -> Path:
    # Cross-platform Desktop path
    # Defaults to ~/Desktop; if not present, uses home
    home = Path.home()
    candidates = [home / "Desktop", home / "desktop", home]
    for c in candidates:
        if c.exists():
            return c
    return home

def load_rules(path: str | None):
    if not path:
        return DEFAULT_RULES
    p = Path(path)
    if not p.exists():
        print(f"[!] Rules file not found: {p}. Using defaults.", file=sys.stderr)
        return DEFAULT_RULES
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
        # Merge: custom keys override, but keep defaults for anything not specified
        merged = dict(DEFAULT_RULES)
        for k, v in data.items():
            merged[k] = [ext.lower() if ext.startswith(".") else "." + ext.lower() for ext in v]
        return merged
    except Exception as e:
        print(f"[!] Failed to parse rules JSON: {e}. Using defaults.", file=sys.stderr)
        return DEFAULT_RULES

def build_extension_map(rules: dict[str, list[str]]) -> dict[str, str]:
    ext_to_folder = {}
    for folder, exts in rules.items():
        for ext in exts:
            ext_to_folder[ext.lower()] = folder
    return ext_to_folder

def safe_move(src: Path, dest_dir: Path) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    target = dest_dir / src.name
    if not target.exists():
        shutil.move(str(src), str(target))
        return target

    stem = target.stem
    suffix = target.suffix
    counter = 1
    while True:
        candidate = dest_dir / f"{stem}-{counter}{suffix}"
        if not candidate.exists():
            shutil.move(str(src), str(candidate))
            return candidate
        counter += 1

def classify_file(path: Path, ext_map: dict[str, str]) -> str:
    ext = path.suffix.lower()
    return ext_map.get(ext, MISC_FOLDER)

def date_subfolder(path: Path) -> str:
    try:
        ts = path.stat().st_mtime
    except Exception:
        ts = time.time()
    dt = datetime.fromtimestamp(ts)
    return dt.strftime("%Y-%m")

def is_hidden(path: Path) -> bool:
    # Skip hidden files like .DS_Store or system cruft
    return path.name.startswith(".")

def is_temporary(path: Path) -> bool:
    return bool(re.search(r"~\$|\.tmp$|\.crdownload$|\.part$|\.partial$", path.name, re.I))

def organize_once(
    root: Path,
    rules_path: str | None,
    by_date: bool,
    dry_run: bool,
    verbose: bool
) -> int:
    rules = load_rules(rules_path)
    ext_map = build_extension_map(rules)
    moved = 0

    for item in root.iterdir():
        if item.is_dir():
            # Skip destination folders (any rule folders + Misc) to avoid loops
            if item.name in rules.keys() or item.name == MISC_FOLDER:
                continue
            # Also skip common system dirs on Desktop
            if item.name in {".Trash", ".DS_Store", "System Volume Information"}:
                continue
            # Skip hidden directories
            if is_hidden(item):
                continue
            # Skip app bundles on macOS (treated as dirs)
            if item.suffix.lower() in {".app"}:
                continue

        if item.is_file():
            if is_hidden(item) or is_temporary(item):
                if verbose:
                    print(f"[-] Skipping hidden/temp: {item.name}")
                continue

            target_folder = classify_file(item, ext_map)
            if by_date:
                sub = date_subfolder(item)
                dest_dir = root / target_folder / sub
            else:
                dest_dir = root / target_folder

            if dry_run:
                print(f"[DRY] {item.name} -> {dest_dir}/")
            else:
                new_path = safe_move(item, dest_dir)
                if verbose:
                    print(f"[OK] {item.name} -> {new_path.relative_to(root)}")
                moved += 1

        elif item.is_dir():
            # If it's a folder someone put on Desktop, leave it alone
            if verbose:
                print(f"[-] Leaving folder: {item.name}")
            continue

    return moved

def try_import_watchdog():
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
        return Observer, FileSystemEventHandler
    except Exception:
        return None, None

def watch_desktop(
    root: Path,
    rules_path: str | None,
    by_date: bool,
    verbose: bool
):
    Observer, FileSystemEventHandler = try_import_watchdog()
    if Observer is None:
        print("[!] --watch requested, but watchdog isn’t installed.\n"
              "    Install it with:  pip install watchdog", file=sys.stderr)
        sys.exit(2)

    class Handler(FileSystemEventHandler):
        def __init__(self):
            super().__init__()
            self.rules_path = rules_path

        def on_created(self, event):
            # Process only files created directly on the Desktop (not subfolders)
            try:
                p = Path(event.src_path)
                if p.parent.resolve() != root.resolve():
                    return
                if p.is_file():
                    # Small delay so apps finish writing
                    time.sleep(0.2)
                    organize_once(root, self.rules_path, by_date, dry_run=False, verbose=verbose)
            except Exception as e:
                if verbose:
                    print(f"[!] Watch error: {e}", file=sys.stderr)

        def on_moved(self, event):
            # If something lands on Desktop, process
            try:
                dest = getattr(event, "dest_path", None)
                if dest and Path(dest).parent.resolve() == root.resolve():
                    time.sleep(0.2)
                    organize_once(root, self.rules_path, by_date, dry_run=False, verbose=verbose)
            except Exception as e:
                if verbose:
                    print(f"[!] Watch error: {e}", file=sys.stderr)

    event_handler = Handler()
    observer = Observer()
    observer.schedule(event_handler, str(root), recursive=False)
    observer.start()
    print(f"[~] Watching {root} (Ctrl+C to stop)…")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def main():
    parser = argparse.ArgumentParser(
        description="Organize your Desktop by file type (and optionally by date)."
    )
    parser.add_argument(
        "--dir", type=str, default=None,
        help="Directory to organize (default: your Desktop)."
    )
    parser.add_argument(
        "--by-date", action="store_true",
        help="Nest files by YYYY-MM inside each category."
    )
    parser.add_argument(
        "--rules", type=str, default=None,
        help="Path to JSON rules file to override/extend categories."
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show what would move without changing anything."
    )
    parser.add_argument(
        "--watch", action="store_true",
        help="Watch the Desktop and organize as files appear (requires watchdog)."
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true",
        help="Print details while organizing."
    )

    args = parser.parse_args()
    root = Path(args.dir).expanduser().resolve() if args.dir else find_desktop()

    if not root.exists() or not root.is_dir():
        print(f"[!] Not a directory: {root}", file=sys.stderr)
        sys.exit(1)

    moved = organize_once(
        root=root,
        rules_path=args.rules,
        by_date=args.by_date,
        dry_run=args.dry_run,
        verbose=args.verbose
    )

    if args.watch and not args.dry_run:
        watch_desktop(root, args.rules, args.by_date, args.verbose)
    else:
        print(f"[✓] Moved {moved} file(s).")

if __name__ == "__main__":
    main()
