#!/usr/bin/env bash
# ==============================================================================
# Java DSA Curriculum End-to-End (E2E) Automated Test Runner
# ==============================================================================
# Discovers, compiles, and executes main methods for all Java source files
# across modules (module01_* through module13_*) and records pass/fail results.
#
# Usage:
#   ./scripts/run_e2e_tests.sh                # Run all tests in src/
#   ./scripts/run_e2e_tests.sh module01        # Run tests matching "module01"
#
# Portable across macOS (bash 3.2+) and Linux systems.
# ==============================================================================

set -u

# Project root resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SRC_DIR="${PROJECT_ROOT}/src"
BUILD_DIR="${PROJECT_ROOT}/build/classes"

FILTER="${1:-}"

# Terminal colors for formatted logging
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}          Java DSA Curriculum E2E Automated Test Suite Execution             ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "Project Root : ${PROJECT_ROOT}"
echo -e "Source Dir   : ${SRC_DIR}"
echo -e "Build Dir    : ${BUILD_DIR}"
if [ -n "${FILTER}" ]; then
  echo -e "Filter       : ${FILTER}"
fi
echo -e "Timestamp    : $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo -e "${BLUE}------------------------------------------------------------------------------${NC}"

# Step 1: Clean and prepare build output directory
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Step 2: Discover Java files into an array (macOS bash 3.2 compatible)
JAVA_FILES=()
while IFS= read -r line; do
  if [ -n "${line}" ]; then
    if [ -z "${FILTER}" ] || [[ "${line}" == *"${FILTER}"* ]]; then
      JAVA_FILES+=("${line}")
    fi
  fi
done < <(find "${SRC_DIR}" -type f -name "*.java" | sort)

TOTAL_FILES=${#JAVA_FILES[@]}

if [ "${TOTAL_FILES}" -eq 0 ]; then
  echo -e "${RED}ERROR: No Java source files matching filter '${FILTER}' found in ${SRC_DIR}${NC}"
  exit 1
fi

echo -e "${CYAN}Found ${TOTAL_FILES} Java source file(s) across curriculum modules.${NC}"

# Step 3: Compile all .java files
echo -e "\n${BLUE}[PHASE 1] Compiling Java Source Files...${NC}"
COMPILE_START=$(date +%s)

javac -d "${BUILD_DIR}" "${JAVA_FILES[@]}" 2>&1
COMPILE_STATUS=$?
COMPILE_END=$(date +%s)
COMPILE_DURATION=$((COMPILE_END - COMPILE_START))

if [ "${COMPILE_STATUS}" -ne 0 ]; then
  echo -e "${RED}[COMPILATION FAILED] javac returned exit code ${COMPILE_STATUS}${NC}"
  exit 1
fi

echo -e "${GREEN}[COMPILATION SUCCESS] ${TOTAL_FILES} file(s) compiled cleanly in ${COMPILE_DURATION}s with zero errors.${NC}"

# Step 4: Execute main methods for each Java class
echo -e "\n${BLUE}[PHASE 2] Running E2E Execution Verification...${NC}"

PASSED_COUNT=0
FAILED_COUNT=0
FAILURES=()

EXEC_START=$(date +%s)

for file in "${JAVA_FILES[@]}"; do
  # Determine class name relative to src/
  rel_path="${file#"${SRC_DIR}/"}"
  rel_path_no_ext="${rel_path%.java}"
  class_name="${rel_path_no_ext//\//.}"

  # Run class main method
  OUTPUT=$(java -cp "${BUILD_DIR}" "${class_name}" 2>&1)
  EXEC_STATUS=$?

  if [ "${EXEC_STATUS}" -eq 0 ]; then
    PASSED_COUNT=$((PASSED_COUNT + 1))
    echo -e "  [${GREEN}PASS${NC}] ${class_name}"
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
    FAILURES+=("${class_name} (exit code: ${EXEC_STATUS})")
    echo -e "  [${RED}FAIL${NC}] ${class_name} (exit code: ${EXEC_STATUS})"
    echo -e "${RED}    Log Output:${NC}\n${OUTPUT}"
  fi
done

EXEC_END=$(date +%s)
EXEC_DURATION=$((EXEC_END - EXEC_START))

# Step 5: Final Summary Report
echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                         E2E TEST SUITE RESULTS                               ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "Total Java Files Discovered : ${TOTAL_FILES}"
echo -e "Total Files Compiled        : ${TOTAL_FILES}"
echo -e "Total E2E Tests Executed   : ${TOTAL_FILES}"
echo -e "Passed                      : ${GREEN}${PASSED_COUNT}${NC}"
echo -e "Failed                      : ${RED}${FAILED_COUNT}${NC}"
echo -e "Compilation Time            : ${COMPILE_DURATION}s"
echo -e "Execution Time              : ${EXEC_DURATION}s"
echo -e "${BLUE}------------------------------------------------------------------------------${NC}"

if [ "${FAILED_COUNT}" -gt 0 ]; then
  echo -e "${RED}FAILURE: ${FAILED_COUNT} test(s) failed execution:${NC}"
  for failure in "${FAILURES[@]}"; do
    echo -e "  - ${RED}${failure}${NC}"
  done
  exit 1
else
  echo -e "${GREEN}SUCCESS: ALL ${PASSED_COUNT} E2E TESTS PASSED CLEANLY!${NC}"
  exit 0
fi
