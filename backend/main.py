from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import json
import os
from datetime import datetime

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# models

class UserCreate(BaseModel):
    name: str
    pin: str

class ClockEvent(BaseModel):
    name: str
    pin: str
    type: Literal['in', 'out']

# helpers

def load_json(filename):
    if not os.path.exists(filename):
        return []
    with open(filename, "r") as f:
        return json.load(f)

def save_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

# routes

@app.post("/api/users/")
def create_user(user: UserCreate):
    users = load_json("users.json")
    if any(u["name"] == user.name for u in users):
        raise HTTPException(status_code=400, detail="User already exists")
    users.append(user.dict())
    save_json("users.json", users)
    return {"message": "User created"}

@app.post("/api/login/")
def login(user: UserCreate):
    users = load_json("users.json")
    for u in users:
        if u["name"] == user.name and u["pin"] == user.pin:
            return {"message": "Login successful", "name": user.name}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/clock/")
def clock(event: ClockEvent):
    clock_data = load_json("clock.json")
    clock_data.append({
        "name": event.name,
        "type": event.type,
        "timestamp": datetime.now().isoformat()
    })
    save_json("clock.json", clock_data)
    return {"message": f"Clocked {event.type}"}