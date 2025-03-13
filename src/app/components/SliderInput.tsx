// Props interface for SliderInput
import {ChangeEvent, Component} from "react";

interface SliderInputProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step: number;
    unit: string;
}

// SliderInput as a class component with typed props
export class SliderInput extends Component<SliderInputProps> {
    constructor(props: SliderInputProps) {
        super(props);
    }

    render() {
        const { label, value, onChange, min, max, step, unit } = this.props;

        return (
            <div>
                <label className="block text-sm font-medium mb-1">
                    {label}: {value}{unit}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={onChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </label>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{min}{unit}</span>
                    <span>{max}{unit}</span>
                </div>
            </div>
        );
    }
}
