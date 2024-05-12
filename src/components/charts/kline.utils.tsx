import { TimeFrames } from "../molecules/kline-block";

/**
 * Utility class for Kline chart for all candlestick related helpers
 */
export default class KlineUtils {
  static monthsAgoToEpoch(months: number) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.getTime();
  }

  static daysAgoToEpoch(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.getTime();
  }

  static getTickFormat(selectedTimeFrame: TimeFrames) {
    switch (selectedTimeFrame) {
      case "All":
      case "5Y":
      case "1Y":
        return "%b '%y";
      case "6M":
      case "3M":
      case "1M":
        return "%d %b";
      case "5D":
        return "%d %b";
      case "1D":
        return "%H:%M";
      default:
        return "%d %b";
    }
  }

  static Tooltip({
    isActive,
    open,
    close,
    high,
    low,
    time,
  }: {
    isActive: boolean;
    open: string;
    close: string;
    high: string;
    low: string;
    time: string;
  }) {
    const isPositive = open < close ? "text-constructive" : "text-destructive";

    return (
      <div
        className="bg-background absolute bottom-[10px] right-[10px] rounded-xl transition-all duration-300 text-nowrap"
        id="tooltip"
      >
        <div className="px-4 flex py-2.5 text-end text-muted-foreground min-w-[250px]">
          <p className="pr-3">{time}</p>
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {isActive && (
              <>
                <p>
                  O: <span className={`${isPositive}`}>{open}</span>
                </p>
                <p>
                  C: <span className={`${isPositive}`}>{close}</span>
                </p>
                <p>
                  H: <span className={`${isPositive}`}>{high}</span>
                </p>
                <p>
                  L: <span className={`${isPositive}`}>{low}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
