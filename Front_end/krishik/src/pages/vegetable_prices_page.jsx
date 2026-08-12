import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  BarChart3,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getTodayVegetables, getVegetableHistory, syncVegetables } from "../api/vegetable.api.js";

const formatCurrency = (value) =>
  `Rs. ${Number(value).toLocaleString("en-NP")}`;

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PriceChart = ({ history }) => {
  const data = useMemo(() => {
    return [...history]
      .reverse()
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-NP", {
          month: "short",
          day: "numeric",
        }),
        minimum: item.minimum,
        maximum: item.maximum,
        average: item.average,
      }));
  }, [history]);

  if (!data.length) return null;

  const maxVal = Math.max(...data.map((d) => d.maximum));
  const minVal = Math.min(...data.map((d) => d.minimum));
  const range = maxVal - minVal || 1;

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-stone-900">Price Trend</h3>
      <p className="text-xs text-stone-500 font-sans">Last {data.length} records</p>
      <div className="mt-4 flex items-end gap-2 overflow-x-auto pb-2">
        {data.map((point, idx) => {
          const avgHeight = ((point.average - minVal) / range) * 100;
          const minHeight = ((point.minimum - minVal) / range) * 100;
          const maxHeight = ((point.maximum - minVal) / range) * 100;

          return (
            <div
              key={idx}
              className="flex min-w-[48px] flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium text-stone-600">
                {formatCurrency(point.average)}
              </span>
              <div className="flex flex-col items-center gap-0.5">
                <ArrowDownToLine className="h-3 w-3 text-leaf-600" style={{ height: `${maxHeight * 0.5}px` }} />
                <div
                  className="w-3 rounded-full bg-harvest-500"
                  style={{ height: `${Math.max(4, avgHeight * 0.6)}px` }}
                />
                <ArrowUpToLine className="h-3 w-3 text-orange-600" style={{ height: `${minHeight * 0.5}px` }} />
              </div>
              <span className="text-[10px] text-stone-500">{point.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function VegetablePricesPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadTodayPrices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTodayVegetables();
      const safe = Array.isArray(data) ? data : [];
      setItems(safe);
      setFilteredItems(safe);
    } catch (err) {
      setError("Unable to load vegetable prices. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayPrices();
  }, [loadTodayPrices]);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    setFilteredItems(
      query
        ? items.filter((item) => item?.name?.toLowerCase().includes(query))
        : items
    );
  }, [search, items]);

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      const result = await syncVegetables();
      toast.success(`Synced ${result.total} prices. Saved: ${result.savedCount}`);
      await loadTodayPrices();
    } catch (err) {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectVegetable = async (name) => {
    setSelectedVegetable(name);
    setHistoryLoading(true);
    try {
      const data = await getVegetableHistory(name, { limit: 30 });
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const todayFormatted = useMemo(
    () => formatDate(new Date()),
    []
  );

  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-800 font-serif">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-sans">
                Market Prices
              </p>
              <h1 className="mt-2 text-3xl font-normal text-stone-900 sm:text-4xl">
                Vegetable Prices Today
              </h1>
              <p className="mt-2 text-sm font-sans text-stone-600">
                Updated rates from RamroPatro — {todayFormatted}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={syncing}
              className="inline-flex items-center gap-2 self-start rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium font-sans text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Refresh Prices"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search vegetables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white pl-10 pr-4 py-2.5 text-sm font-sans text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800"
            />
          </div>
          <p className="text-xs font-sans text-stone-500">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-stone-200 bg-white p-5"
              >
                <div className="h-5 w-2/3 rounded bg-stone-100/50" />
                <div className="mt-4 h-4 w-1/2 rounded bg-stone-100/50" />
                <div className="mt-2 h-4 w-1/3 rounded bg-stone-100/50" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-100/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Something went wrong</h3>
            <p className="mt-2 max-w-sm text-sm text-stone-500">{error}</p>
            <button
              type="button"
              onClick={loadTodayPrices}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-emerald-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-100/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">No vegetables found</h3>
            <p className="mt-2 max-w-sm text-sm text-stone-500">
              {search ? "Try adjusting your search terms." : "No price data is available yet."}
            </p>
            {!search && (
              <button
                type="button"
                onClick={handleRefresh}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-emerald-800"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Prices
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <button
                  key={`${item.name}-${item.unit}-${item.date}`}
                  type="button"
                  onClick={() => handleSelectVegetable(item.name)}
                  className={`rounded-xl border bg-white p-5 text-left transition hover:border-emerald-800 hover:shadow-sm ${
                    selectedVegetable === item.name
                      ? "border-emerald-800 ring-1 ring-emerald-800"
                      : "border-stone-200"
                  }`}
                >
                  <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs font-sans text-stone-500">
                    Unit: {item.unit}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 font-sans text-xs">
                    <div>
                      <p className="text-stone-500">Min</p>
                      <p className="font-semibold text-leaf-700">
                        {formatCurrency(item.minimum)}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500">Max</p>
                      <p className="font-semibold text-orange-700">
                        {formatCurrency(item.maximum)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-stone-500">Average</p>
                      <p className="font-semibold text-harvest-600">
                        {formatCurrency(item.average)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedVegetable && (
              <div className="mt-10 rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {selectedVegetable}
                    </h3>
                    <p className="text-xs font-sans text-stone-500">
                      Price history from the database
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVegetable(null);
                      setHistory([]);
                    }}
                    className="text-xs font-sans text-stone-500 underline hover:text-stone-900"
                  >
                    Close history
                  </button>
                </div>

                {historyLoading ? (
                  <div className="mt-6 flex h-32 items-center justify-center text-sm text-stone-500">
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="mt-6 text-center text-sm text-stone-500">
                    No historical data available yet.
                  </div>
                ) : (
                  <>
                    <PriceChart history={history} />
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-sm font-sans">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500">
                            <th className="py-2 pr-4 font-medium">Date</th>
                            <th className="py-2 pr-4 font-medium">Min</th>
                            <th className="py-2 pr-4 font-medium">Max</th>
                            <th className="py-2 font-medium">Avg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((record) => (
                            <tr
                              key={`${record._id}-${record.date}`}
                              className="border-b border-stone-100 last:border-0"
                            >
                              <td className="py-2 pr-4 text-stone-900">
                                {formatDate(record.date)}
                              </td>
                              <td className="py-2 pr-4 text-leaf-700">
                                {formatCurrency(record.minimum)}
                              </td>
                              <td className="py-2 pr-4 text-orange-700">
                                {formatCurrency(record.maximum)}
                              </td>
                              <td className="py-2 text-harvest-600">
                                {formatCurrency(record.average)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
