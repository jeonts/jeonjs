@echo off
echo 🚀 Running all converted tests...

echo.
echo === Running Function Round-trip Test ===
pnpm tsx src/test/roundTripFunctionTest.ts

echo.
echo === Running Variable Round-trip Test ===
pnpm tsx src/test/variableRoundTripTest.ts

echo.
echo === Running JSON5 Round-trip Test ===
pnpm tsx src/test/json5RoundTripTest.ts

echo.
echo ✅ All tests completed!