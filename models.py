from pony.orm import Database, Required, PrimaryKey, Optional
from datetime import datetime

db = Database()
db.bind(provider='sqlite', filename='moodtracker.db', create_db=True)

class Raspolozenje(db.Entity):
    id = PrimaryKey(int, auto=True)
    datum = Required(datetime)
    ocjena = Required(int)
    opis = Optional(str)
    datum_kreiranja = Required(datetime, default=datetime.now)
    datum_promjene = Required(datetime, default=datetime.now)

db.generate_mapping(create_tables=True)
