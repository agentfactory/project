# Task: Fetch the claude-academy target design into this repo

Open this file in a Claude Code session that has:
- Network access to `claude-academy.up.railway.app` and `github.com`
- Git access to push to `the-agent-factory/agent-factory-site`

## What to do

1. Clone the source repo locally (it's private, so use the auth this session already has):

   ```bash
   git clone https://github.com/The-Agent-Factory/claude-academy.git /tmp/claude-academy
   ```

2. From this repo (`agent-factory-site`), check out the working branch:

   ```bash
   cd /path/to/agent-factory-site
   git fetch origin
   git checkout claude/update-academy-design-PtdDs
   ```

3. Copy the entire `claude-academy` source tree into a `_target/` folder at the root of this repo:

   ```bash
   mkdir -p _target
   cp -R /tmp/claude-academy/. _target/
   rm -rf _target/.git
   ```

4. Commit and push:

   ```bash
   git add _target
   git commit -m "Snapshot claude-academy source for design reference"
   git push -u origin claude/update-academy-design-PtdDs
   ```

5. (Optional but useful) Also save a rendered snapshot of the live site so I can verify
   the build matches the deployed look:

   ```bash
   curl -sSL https://claude-academy.up.railway.app/ -o _target/_live-index.html
   git add _target/_live-index.html
   git commit -m "Add live snapshot of claude-academy"
   git push
   ```

Once that's pushed, return to the original session and tell me the snapshot is in
`_target/`. I'll port the design into `index.html` (and `fr.html` for the French version)
on the `claude/update-academy-design-PtdDs` branch.
