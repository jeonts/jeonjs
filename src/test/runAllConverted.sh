#!/bin/bash

echo "🚀 Running all converted tests..."

echo -e "\n=== Running Function Round-trip Test ==="
pnpm tsx src/test/roundTripFunctionTest.ts

echo -e "\n=== Running Variable Round-trip Test ==="
pnpm tsx src/test/variableRoundTripTest.ts

echo -e "\n=== Running JSON5 Round-trip Test ==="
pnpm tsx src/test/json5RoundTripTest.ts

echo -e "\n✅ All tests completed!"