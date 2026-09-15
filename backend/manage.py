#!/usr/bin/env python3
"""
CLI entry point for running the FastAPI backend server, seeding data, or running tests.
Usage:
    python manage.py runserver      # Starts the FastAPI uvicorn server
    python manage.py seed           # Seeds the database with demo accounts & courses
    python manage.py test           # Runs the test suite
"""
import sys
import os

# Auto-detect and switch to virtualenv python if current python lacks uvicorn
try:
    import uvicorn
except ImportError:
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(backend_dir, "venv", "bin", "python")
    if os.path.exists(venv_python) and sys.executable != venv_python:
        os.execv(venv_python, [venv_python] + sys.argv)
    else:
        print("Error: 'uvicorn' is not installed. Please activate your virtualenv or run: pip install -r requirements.txt")
        sys.exit(1)

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    args = sys.argv[1:]
    command = args[0] if args else "runserver"

    if command == "runserver":
        port = 8000
        host = "127.0.0.1"
        for arg in args[1:]:
            if ":" in arg:
                host, port = arg.split(":")
                port = int(port)
            elif arg.isdigit():
                port = int(arg)

        print(f"🚀 Starting FastAPI LMS Server on http://{host}:{port}")
        print(f"📚 OpenAPI Documentation: http://{host}:{port}/api/v1/docs")
        uvicorn.run("app.main:app", host=host, port=port, reload=True)

    elif command == "seed":
        from app.seed import seed_database
        seed_database()

    elif command == "test":
        import pytest
        sys.exit(pytest.main(["tests/", "-v"]))

    else:
        print(f"Unknown command: '{command}'")
        print("Available commands: runserver, seed, test")
        sys.exit(1)

if __name__ == "__main__":
    main()

