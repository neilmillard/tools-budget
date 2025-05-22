export interface BGLesson {
    button: string;
    title: string;
    summary: string;
    citation: string;
    story: string;
}

export const bgLessons: BGLesson[] = [
    {
        button: "Intrinsic Value",
        title: "Focus on Intrinsic Value, Not Market Price",
        summary: "Determine a company's intrinsic value based on its fundamentals rather than following market trends.",
        citation: "The intelligent investor is a realist who sells to optimists and buys from pessimists. Price is what you pay. Value is what you get.",
        story: "Graham would meticulously analyze financial statements, particularly the balance sheet, to determine a company's true worth. He would look at assets, earnings potential, and dividends to calculate intrinsic value, then compare it to the market price to identify undervalued opportunities."
    },
    {
        button: "Mr. Market",
        title: "The Allegory of Mr. Market",
        summary: "View the market as a manic-depressive business partner who offers to buy or sell shares at different prices every day.",
        citation: "The market is there to serve you, not to instruct you. If it makes more sense to you to trade with Mr. Market, do so, but only when it is to your advantage.",
        story: "Graham created the Mr. Market allegory to help investors understand market volatility. Some days Mr. Market is optimistic and offers high prices; other days he's pessimistic and offers low prices. The intelligent investor takes advantage of Mr. Market's mood swings rather than being influenced by them."
    },
    {
        button: "Diversification",
        title: "Adequate Diversification",
        summary: "Spread investments across different securities to reduce risk.",
        citation: "Diversification is an established tenet of conservative investment. The defensive investor must confine himself to the shares of important companies with a long record of profitable operations and in strong financial condition.",
        story: "Graham recommended owning between 10 and 30 stocks across different industries. When one of his students asked if they should put all their money in one stock they were certain would rise, Graham replied, 'You are not being paid to be certain. You are being paid to consider the odds.'"
    },
    {
        button: "Analysis",
        title: "Thorough Financial Analysis",
        summary: "Conduct detailed analysis of financial statements and ratios before investing.",
        citation: "Operations not meeting the test of the past should be regarded with considerable skepticism. The investor should demand a substantial premium for assuming the greater uncertainties of the future.",
        story: "Graham would analyze at least 5 years of financial data, looking at debt-to-equity ratios, current ratios, earnings stability, and dividend records. He once identified a company trading below its net current asset value because the market had overlooked its strong balance sheet during a general market decline."
    },
    {
        button: "Long-term",
        title: "Long-term Investment Perspective",
        summary: "Invest for the long term rather than speculating for quick profits.",
        citation: "In the short run, the market is a voting machine but in the long run, it is a weighing machine. The individual investor should act consistently as an investor and not as a speculator.",
        story: "Graham distinguished between investment (based on thorough analysis and safety of principal) and speculation (relying on market movements). He advised his clients to ignore short-term market fluctuations and focus on the underlying business value, which would be recognized by the market over time."
    },
    {
        button: "Investor Types",
        title: "Defensive vs. Enterprising Investor",
        summary: "Tailor your investment approach based on your time, interest, and expertise.",
        citation: "The defensive investor must confine himself to the shares of important companies with a long record of profitable operations and in strong financial condition. The enterprising investor may buy other types of common stocks, but he must take special care to find them adequately attractive.",
        story: "Graham categorized investors into two types: defensive (passive) investors who want protection from serious mistakes and enterprising (active) investors willing to devote time and effort to portfolio management. He provided different strategies for each type, recognizing that not everyone has the same resources or objectives."
    },
    {
        button: "Quality",
        title: "Quality and Growth",
        summary: "Invest in companies with strong financial positions and reasonable growth prospects.",
        citation: "Growth stocks are likely to be found mainly among the major companies that are going through a period of exceptional expansion. The risk of paying too high a price for good-quality stocks is not likely to be a serious one if you stick to companies that have been around for a long time.",
        story: "While Graham was primarily known for value investing, he recognized the importance of quality and growth. He invested in GEICO when it was a small, unknown insurance company, seeing its potential for growth due to its unique business model of selling directly to customers. This investment eventually became worth more than all his other investments combined."
    }
];
