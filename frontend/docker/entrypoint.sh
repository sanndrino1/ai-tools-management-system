#!/bin/sh
set -e

# If running as root, ensure /app ownership and then drop to nextjs
if [ "$(id -u)" -eq 0 ]; then
  echo "[entrypoint] Running as root — fixing ownership of /app if needed"
  # Attempt to set ownership; ignore errors if filesystem doesn't support chown
  chown -R nextjs:nodejs /app 2>/dev/null || true
  # Ensure node_modules exists and has correct perms
  mkdir -p /app/node_modules || true
  chown -R nextjs:nodejs /app/node_modules 2>/dev/null || true
  
  # If developer wants to allow running the process as root (useful on Windows
  # when bind mounts don't support chown), set DEV_ALLOW_ROOT=1 in the
  # service environment to skip dropping privileges.
  if [ "${DEV_ALLOW_ROOT:-0}" = "1" ] || [ "${DEV_ALLOW_ROOT:-0}" = "true" ]; then
    echo "[entrypoint] DEV_ALLOW_ROOT set — running command as root: $@"
    exec "$@"
  fi
  
  # If su-exec is present, use it to run as nextjs
  if command -v su-exec >/dev/null 2>&1; then
    echo "[entrypoint] Using su-exec to drop to nextjs and exec: $@"
    exec su-exec nextjs "$@"
  else
    # Fallback to su -c
    echo "[entrypoint] su-exec not found, using su to run as nextjs"
    su nextjs -s /bin/sh -c "exec \"$@\""
  fi
else
  # Already non-root — just exec
  exec "$@"
fi
