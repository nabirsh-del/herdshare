#!/bin/bash

echo "Saving and closing everything..."

# Save all open documents in common apps (triggers Cmd+S)
osascript -e 'tell application "System Events" to keystroke "s" using command down' 2>/dev/null

# Give apps a moment to save
sleep 2

# Commit any uncommitted changes in this project
cd /Users/nikolaibirsh/Projects/herdshare
if [[ -n $(git status --porcelain) ]]; then
    echo "Saving uncommitted git changes..."
    git add -A
    git commit -m "Auto-save before shutdown $(date '+%Y-%m-%d %H:%M')"
    git push 2>/dev/null
fi

echo ""
echo "==================================="
echo "TO RESUME TOMORROW:"
echo "1. Open Terminal"
echo "2. cd ~/Projects/herdshare"
echo "3. claude --continue"
echo "==================================="
echo ""

# Close all apps gracefully
osascript -e 'tell application "System Events" to set quitapps to name of every application process whose background only is false and name is not "Finder"'
osascript -e 'tell application "System Events"
    set appList to name of every application process whose background only is false and name is not "Finder"
    repeat with appName in appList
        try
            tell application appName to quit
        end try
    end repeat
end tell'

echo "All apps closed. You can now shut down your computer."
echo "Goodnight!"
