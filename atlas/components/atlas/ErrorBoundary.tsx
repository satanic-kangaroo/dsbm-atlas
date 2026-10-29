"use client";
import { Component, type ReactNode } from "react";

/** If the 3D globe throws (old GPU, blocked WebGL), fall back to the tile map instead of a blank page. */
export default class ErrorBoundary extends Component<{ fallback: ReactNode; onError?: () => void; children: ReactNode }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.bad ? this.props.fallback : this.props.children; }
}
