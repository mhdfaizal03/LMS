#!/usr/bin/env python3
"""
Root level wrapper for LMS manage.py.
Dispatches directly to backend/manage.py with the virtual environment.
"""
import sys
import os

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
backend_manage = os.path.join(backend_dir, "manage.py")
venv_python = os.path.join(backend_dir, "venv", "bin", "python")

if os.path.exists(venv_python):
    os.chdir(backend_dir)
    os.execv(venv_python, [venv_python, backend_manage] + sys.argv[1:])
else:
    os.chdir(backend_dir)
    os.execv(sys.executable, [sys.executable, backend_manage] + sys.argv[1:])
