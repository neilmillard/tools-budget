import {Bar} from "react-chartjs-2";
import {Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip} from "chart.js";

export interface DataPoint {
  year: number;
  savings: number;
}

export interface InvestmentChartProps {
  chart: DataPoint[];
  label: string;
  responsive?: boolean;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InvestmentChart(props: InvestmentChartProps) {
  const {chart, label, responsive = false} = props;
  const data = {
    labels: chart.map((point) => point.year.toString()),
    datasets: [
      {
        label: label,
        data: chart.map((point) => point.savings),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
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
          text: "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={data}/>;
}
