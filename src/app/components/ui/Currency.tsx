// Currency type interface
import React, {ChangeEvent} from "react";

export interface Currency {
    code: string;
    symbol: string;
    name: string;
}

export const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
//     { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
//     { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
//     { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
//     { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
//     { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
 ];

export function currencyLookup(currencyCode: string): Currency {
    return currencies.find(c => c.code === currencyCode) || currencies[0];
}

{/* Currency selector */}
export function CurrencySelector(props: { selectedCurrency: Currency, onChange: (e: ChangeEvent<HTMLSelectElement>) => void}) {
    return <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="currency">Currency</label>
        <select
            id="currency"
            value={props.selectedCurrency.code}
            onChange={props.onChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        >
            {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.symbol} - {currency.name}
                </option>
            ))}
        </select>
    </div>;
}

