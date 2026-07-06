'use client';

interface TokenStats {
  totalSupply: number;
  circulatingSupply: number;
  totalStaked: number;
  totalHolders: number;
  marketCap?: number;
  price?: number;
}

interface TokenStatisticsProps {
  stats: TokenStats;
  loading?: boolean;
}

export function TokenStatistics({ stats, loading }: TokenStatisticsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-24 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  const stakingPercentage = ((stats.totalStaked / stats.totalSupply) * 100).toFixed(2);
  const circulatingPercentage = ((stats.circulatingSupply / stats.totalSupply) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Total Supply</h3>
        <p className="text-2xl font-bold mt-2">{formatNumber(stats.totalSupply)}</p>
        <p className="text-xs text-gray-500 mt-1">HEALTH tokens</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Circulating</h3>
        <p className="text-2xl font-bold mt-2">{formatNumber(stats.circulatingSupply)}</p>
        <p className="text-xs text-green-400 mt-1">{circulatingPercentage}% of supply</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Total Staked</h3>
        <p className="text-2xl font-bold mt-2">{formatNumber(stats.totalStaked)}</p>
        <p className="text-xs text-accent-foreground mt-1">{stakingPercentage}% staked</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Total Holders</h3>
        <p className="text-2xl font-bold mt-2">{formatNumber(stats.totalHolders)}</p>
        <p className="text-xs text-gray-500 mt-1">Unique addresses</p>
      </div>

      {stats.price !== undefined && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Token Price</h3>
          <p className="text-2xl font-bold mt-2">${stats.price.toFixed(4)}</p>
          <p className="text-xs text-gray-500 mt-1">USD per token</p>
        </div>
      )}

      {stats.marketCap !== undefined && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Market Cap</h3>
          <p className="text-2xl font-bold mt-2">${formatNumber(stats.marketCap)}</p>
          <p className="text-xs text-gray-500 mt-1">Total value</p>
        </div>
      )}
    </div>
  );
}
