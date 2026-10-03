# Sourced by emulator scripts: puts a Java 21+ runtime on PATH (Firebase emulators need it).
java_major() { "$1" -version 2>&1 | awk -F'"' '/version/ {split($2, v, "."); print v[1]; exit}'; }

if [ -z "${JAVA_HOME:-}" ] || [ "$(java_major "$JAVA_HOME/bin/java")" -lt 21 ] 2>/dev/null; then
  for candidate in /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21 "$(/usr/libexec/java_home -v 21+ 2>/dev/null || true)"; do
    if [ -n "$candidate" ] && [ -x "$candidate/bin/java" ]; then
      export JAVA_HOME="$candidate"
      break
    fi
  done
fi
if [ -n "${JAVA_HOME:-}" ]; then export PATH="$JAVA_HOME/bin:$PATH"; fi
