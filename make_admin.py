from app.database import SessionLocal, engine
from app.models import User, RoleEnum, Base

Base.metadata.create_all(bind=engine)

TARGET_USERNAME = "admin" 

db = SessionLocal()
user = db.query(User).filter(User.username == TARGET_USERNAME).first()

if user:
    user.role = RoleEnum.admin
    db.commit()
    print(f"Success! '{user.username}' is now an admin.")
else:
    print(f"User '{TARGET_USERNAME}' not found. You must register them via the web UI first.")
    
db.close()
