# Adopt remote branch: fetch, hard-reset, and clean untracked files
# Usage: .\scripts\adopt-remote.ps1
$branch = git rev-parse --abbrev-ref HEAD
Write-Output "Adopting origin/$branch -> local $branch"
git fetch origin
git reset --hard origin/$branch
git clean -fd
Write-Output "Done. Local $branch now matches origin/$branch"