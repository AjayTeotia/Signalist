"use client";

import { StarIcon, Trash2Icon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/use-debounce";

import {
  addToWatchList,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

// Minimal WatchlistButton implementation to satisfy page requirements.
// This component focuses on UI contract only. It toggles local state and
// calls onWatchlistChange if provided. Styling hooks match globals.css.

export function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  // Handle adding/removing stocks from watchlist
  async function toggleWatchlist() {
    const result = added
      ? await removeFromWatchlist(symbol)
      : await addToWatchList(symbol, company);

    if (result.success) {
      toast.success(added ? "Removed from Watchlist" : "Added to Watchlist", {
        description: `${company} ${
          added ? "removed from" : "added to"
        } your watchlist`,
      });

      // Notify parent component of watchlist change for state synchronization
      onWatchlistChange?.(symbol, !added);
    }
  }

  // Debounce the toggle function to prevent rapid API calls (300ms delay)
  const debouncedToggle = useDebounce(toggleWatchlist, 300);

  // Click handler that provides optimistic UI updates
  function handleClick(e: React.MouseEvent) {
    // Prevent event bubbling and default behavior
    e.stopPropagation();
    e.preventDefault();

    setAdded(!added);
    debouncedToggle();
  }

  if (type === "icon") {
    return (
      <button
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <StarIcon fill={added ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
    >
      {showTrashIcon && added ? <Trash2Icon /> : null}
      <span>{label}</span>
    </button>
  );
}
