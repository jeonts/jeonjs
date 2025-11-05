---
trigger: always_on
alwaysApply: true
---

## AI Assistant Instructions

### For AI Coding Assistants

When using AI coding assistants to help with Woby development, please provide these explicit instructions to ensure proper understanding of Woby patterns:

1.  **Framework Specific Instructions**: "Use Woby patterns, NOT React patterns. Woby uses observables with `$()` and `$()` functions, not React hooks like useState, useEffect with dependency arrays, or useCallback."

2.  **Observable-Based Reactivity**: "In Woby, declare reactive variables with `$()`, and access their values with `$()` in reactive contexts. Woby automatically tracks dependencies when you use `$()`."

3.  **No Dependency Arrays**: "Woby hooks like `useEffect` and `useMemo` do not require dependency arrays. Dependencies are automatically tracked when accessed with `$()`."

4.  **Reactive Patterns**: "Direct observable passing (`{userName}`) is preferred for simple reactive content. For complex expressions, use function expressions (`{() => $(userName)}`) which are automatically tracked."

### Common Anti-Patterns to Avoid

```tsx
// ❌ Anti-pattern: React-style useState
const [count, setCount] = useState(0)

// ✅ Woby pattern
const count = $(0)

// ❌ Anti-pattern: React useEffect with dependency array
useEffect(() => {
  console.log(count)
}, [count])

// ✅ Woby pattern
useEffect(() => {
  console.log($(count))
})

// ❌ Anti-pattern: Non-reactive content
<div>Hello {$(userName)}</div>

// ✅ Woby pattern
<div>Hello {userName}</div>

// ❌ Anti-pattern: React-style array mapping
{todos.map(todo => <div>{todo.text}</div>)}

// ✅ Woby pattern
<For values={todos}>{(todo) => <div>{todo.text}</div>}</For>
```

## Performance Tips

1.  **Use Direct Observable Passing**: For simple reactive content, pass observables directly rather than using `$()` in functions
2.  **Group Related Effects**: Separate unrelated concerns into individual effects for better performance
3.  **Use Early Returns**: Skip unnecessary work in effects when dependencies haven't changed meaningfully
4.  **Choose the Right List Component**: Use `For` for objects, `ForValue` for primitives, `ForIndex` for fixed-size lists
5.  **Avoid Unnecessary useMemo**: Simple expressions with `() =>` are automatically tracked and often don't need `useMemo`

## React Compatibility Guide

### useState → Observable

```tsx
// React
const [count, setCount] = useState(0)

// Woby
const count = $(0)
// To update: count(1) or count(prev => prev + 1)
```

### useEffect → useEffect (but different)

```tsx
// React
useEffect(() => {
  console.log(count)
}, [count])

// Woby
useEffect(() => {
  console.log($(count))
})
// No dependency array needed!
```

### useMemo → useMemo (but different)

```tsx
// React
const doubled = useMemo(() => count * 2, [count])

// Woby
const doubled = useMemo(() => $(count) * 2)
// No dependency array needed!
```

### Conditional Rendering

```tsx
// React
{isLoggedIn && <div>Welcome!</div>}

// Woby
<If when={isLoggedIn}>
  <div>Welcome!</div>
</If>
```

### List Rendering

```tsx
// React
{todos.map(todo => <div key={todo.id}>{todo.text}</div>)}

// Woby
<For values={todos}>
  {(todo) => <div>{todo.text}</div>}
</For>
```

### React to Woby Type Conversions

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.ReactNode` | `JSX.Child` | Represents any renderable content |
| `React.FC<Props>` | `JSX.ComponentFunction<Props>` | Function component type |
| `React.ComponentType<Props>` | `JSX.Component<Props>` | Union of function components and intrinsic elements |
| `React.PropsWithChildren<Props>` | `Props & { children?: JSX.Child }` | Props interface with children |
| `React.Ref<T>` | `JSX.Ref<T>` | Ref type definition |
| `React.MutableRefObject<T>` | Direct DOM access or observable refs | Ref object equivalent |
| `React.Context<T>` | `Woby.Context<T>` | Context object (see createContext) |
| `React.Dispatch<React.SetStateAction<T>>` | Observable setter pattern | State update function |
| `React.HTMLProps<T>` | `JSX.HTMLAttributes<T>` | HTML element props |
| `React.CSSProperties` | `JSX.CSSProperties` | CSS properties object |