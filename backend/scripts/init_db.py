import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.init_db import init_db
from app.db.seed import seed_db
from app.db.session import SessionLocal


def main() -> None:
    init_db()
    with SessionLocal() as db:
        seed_db(db)


if __name__ == "__main__":
    main()
