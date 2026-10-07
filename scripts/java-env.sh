# Sourced by emulator scripts: puts a Java 21+ runtime on PATH (Firebase emulators need it).
java_major() { "$1" -version 2>&1 | awk -F'"' '/version/ {split($2, v, "."); print v[1]; exit}'; }

java_bin_ok() {
  local home="$1"
  [ -x "$home/bin/java" ] || [ -f "$home/bin/java.exe" ]
}

if [ -z "${JAVA_HOME:-}" ] || [ "$(java_major "$JAVA_HOME/bin/java")" -lt 21 ] 2>/dev/null; then
  candidates=(
    /opt/homebrew/opt/openjdk@21
    /usr/local/opt/openjdk@21
  )
  # macOS java_home helper (no-op on Windows/Linux)
  if command -v /usr/libexec/java_home >/dev/null 2>&1; then
    candidates+=("$(/usr/libexec/java_home -v 21+ 2>/dev/null || true)")
  fi
  # Windows installs (Git Bash / MSYS paths)
  for base in \
    "/c/Program Files/Microsoft" \
    "/c/Program Files/Eclipse Adoptium" \
    "/c/Program Files/Java" \
    "/c/Program Files/Amazon Corretto" \
    "/c/Program Files/Temurin"; do
    [ -d "$base" ] || continue
    for dir in "$base"/jdk-21* "$base"/jdk-21.* "$base"/OpenJDK21*; do
      [ -d "$dir" ] && candidates+=("$dir")
    done
  done

  for candidate in "${candidates[@]}"; do
    [ -n "$candidate" ] || continue
    if java_bin_ok "$candidate"; then
      export JAVA_HOME="$candidate"
      break
    fi
  done
fi
if [ -n "${JAVA_HOME:-}" ]; then export PATH="$JAVA_HOME/bin:$PATH"; fi
