// Props interface for CurrencyInput
import {ChangeEvent, Component} from "react";

interface CurrencyInputProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    testId: string;
    min?: number;
    step?: number;
    currencySymbol?: string;
}

// Input component for currency fields
export class CurrencyInput extends Component<CurrencyInputProps> {
    static defaultProps = {
        min: 0,
        step: 1000,
        currencySymbol: "",
     };
    render() {
        const {label, value, onChange, testId, min, step, currencySymbol} = this.props;

        return (
            <div>
                <label className="block text-sm font-medium mb-1">{label}
                    <div className="flex items-center">
                        <span className="mr-2">{currencySymbol}</span>
                        <input
                            data-testid={testId}
                            type="number"
                            value={value}
                            onChange={onChange}
                            className="w-full p-2 border rounded"
                            min={min}
                            step={step}
                        />
                    </div>
                </label>
            </div>
        );
    }
}
