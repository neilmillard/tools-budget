import {Bar} from "react-chartjs-2";
import {Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip} from "chart.js";

export interface DataPoint {
  age: number;
  savings: number;
}

export interface SavingsChartProps {
  chart: DataPoint[];
  label: string;
  responsive?: boolean;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SavingsChart(props: SavingsChartProps) {
  const {chart, label, responsive = false} = props;
  const data = {
    labels: chart.map((point) => point.age.toString()),
    datasets: [
      {
        label: label,
        data: chart.map((point) => point.savings),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: responsive,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        text: label,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Age",
        },
      },
      y: {
        title: {
          display: true,
          text: "Savings",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={data}/>;
}
