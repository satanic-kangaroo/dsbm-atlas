"use client";
import { Component, type ReactNode } from "react";

/** If the 3D globe throws (old GPU, blocked WebGL, a library error), show the fallback WITH the reason instead of a silent blank. */
export default class ErrorBoundary extends Component<{ fallback: (message: string, retry: () => void) => ReactNode; children: ReactNode }, { err: Error | null }> {
  state: { err: Error | null } = { err: null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error("[DSBM Atlas] globe failed:", err); }
  render() { return this.state.err ? this.props.fallback(`${this.state.err.name}: ${this.state.err.message}`, () => this.setState({ err: null })) : this.props.children; }
}
