import { StarIcon } from "lucide-react";

import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistWithData } from "@/lib/actions/getWatchlistWithData.action";

import { SearchCommand } from "@/components/search-command";
import { WatchlistTable } from "@/components/watchlist-table";

export default async function WatchlistPage() {
  const watchlsit = await getWatchlistWithData();
  const initialStocks = await searchStocks();

  // empty watchlist
  if (watchlsit.length === 0) {
    return (
      <div className="watchlist-empty-wrapper">
        <div className="flex watchlist-empty-container">
          <div className="watchlist-empty">
            <StarIcon className="watchlist-star" />

            <h2 className="empty-title">Your watchlist is empty</h2>

            <p className="empty-description">
              Start building your watchlist by searching for stocks and clicking
              the star icon to add them.
            </p>
          </div>
        </div>

        <SearchCommand initialStocks={initialStocks} />
      </div>
    );
  }

  return (
    <section className="watchlist">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="watchlist-title">Watchlist</h2>

          <SearchCommand initialStocks={initialStocks} />
        </div>

        <WatchlistTable watchlist={watchlsit} />
      </div>
    </section>
  );
}
