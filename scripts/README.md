Adopt remote script

Usage:

PowerShell:

    .\scripts\adopt-remote.ps1

This fetches `origin`, hard-resets the current branch to `origin/<branch>`,
and removes untracked files. Use with caution — this is destructive for local
changes.