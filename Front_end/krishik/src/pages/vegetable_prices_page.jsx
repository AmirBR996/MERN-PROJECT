import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  Leaf,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getTodayVegetables,
  getVegetableHistory,
  syncVegetables,
} from "../api/vegetable.api.js";

const formatCurrency = (value) => `Rs. ${Number(value).toLocaleString("en-NP")}`;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
    } catch {
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
      query ? items.filter((item) => item?.name?.toLowerCase().includes(query)) : items
    );
  }, [search, items]);

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedVegetable(null);
      setHistory([]);
      return;
    }

    const exists = filteredItems.some((item) => item.name === selectedVegetable);
    if (!selectedVegetable || !exists) {
      setSelectedVegetable(filteredItems[0].name);
    }
  }, [filteredItems, selectedVegetable]);

  useEffect(() => {
    if (!selectedVegetable) return;

    let ignore = false;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await getVegetableHistory(selectedVegetable, { limit: 30 });
        if (!ignore) setHistory(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setHistory([]);
      } finally {
        if (!ignore) setHistoryLoading(false);
      }
    };

    loadHistory();
    return () => {
      ignore = true;
    };
  }, [selectedVegetable]);

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      const result = await syncVegetables();
      toast.success(`Synced ${result.total} prices.`);
      await loadTodayPrices();
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const stats = useMemo(() => {
    if (!items.length) return { total: 0, highest: null, lowest: null };
    const highest = items.reduce(
      (max, item) => (Number(item.average) > Number(max.average) ? item : max),
      items[0]
    );
    const lowest = items.reduce(
      (min, item) => (Number(item.average) < Number(min.average) ? item : min),
      items[0]
    );
    return { total: items.length, highest, lowest };
  }, [items]);

  const selectedDetails = useMemo(
    () => items.find((item) => item?.name === selectedVegetable) || null,
    [items, selectedVegetable]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
              <Leaf className="h-4 w-4" /> Market Overview
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Vegetable Wholesale Prices
            </h1>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Prices"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metric Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Listed
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Highest Average
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.highest ? formatCurrency(stats.highest.average) : "-"}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">{stats.highest?.name || "N/A"}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-rose-500" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Lowest Average
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.lowest ? formatCurrency(stats.lowest.average) : "-"}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">{stats.lowest?.name || "N/A"}</p>
              </div>
              <TrendingDown className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Item List Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vegetables..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="h-[600px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading items...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-sm text-rose-600">{error}</div>
              ) : filteredItems.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No items found.</div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const active = selectedVegetable === item.name;
                    return (
                      <button
                        key={`${item.name}-${item.unit}`}
                        type="button"
                        onClick={() => setSelectedVegetable(item.name)}
                        className={`w-full rounded-lg px-4 py-3 text-left transition flex items-center justify-between ${
                          active
                            ? "bg-emerald-50 text-emerald-900 font-medium"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-500">Per {item.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(item.average)}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            Min: {formatCurrency(item.minimum)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Details & History Column */}
          <div className="lg:col-span-7">
            {selectedDetails ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedDetails.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Updated: {formatDate(selectedDetails.date)}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Unit: {selectedDetails.unit}
                  </span>
                </div>

                {/* Rates Highlight */}
                <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-slate-50 p-4 text-center">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase">Min Price</span>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {formatCurrency(selectedDetails.minimum)}
                    </p>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-xs font-medium text-slate-500 uppercase">Average</span>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {formatCurrency(selectedDetails.average)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase">Max Price</span>
                    <p className="mt-1 text-lg font-bold text-amber-600">
                      {formatCurrency(selectedDetails.maximum)}
                    </p>
                  </div>
                </div>

                {/* History Table */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-500" /> Historical Log
                  </h3>
                  {historyLoading ? (
                    <div className="py-8 text-center text-sm text-slate-500">Loading history...</div>
                  ) : history.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">No history available.</div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                            <th className="px-4 py-2.5">Date</th>
                            <th className="px-4 py-2.5">Min</th>
                            <th className="px-4 py-2.5">Max</th>
                            <th className="px-4 py-2.5">Avg</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {history.map((record) => (
                            <tr key={`${record._id}-${record.date}`} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2.5 text-slate-700">{formatDate(record.date)}</td>
                              <td className="px-4 py-2.5 text-emerald-600">{formatCurrency(record.minimum)}</td>
                              <td className="px-4 py-2.5 text-amber-600">{formatCurrency(record.maximum)}</td>
                              <td className="px-4 py-2.5 font-medium text-slate-900">{formatCurrency(record.average)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <Leaf className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-600">Select an item from the list to see pricing details.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}