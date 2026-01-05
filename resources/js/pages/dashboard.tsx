import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    PiggyBank,
    LucideIcon,
} from 'lucide-react';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
} from 'recharts';

/* ======================
   BREADCRUMBS
====================== */
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

/* ======================
   TYPES
====================== */
type Transaction = {
    id: number;
    name: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
};

type Props = {
    summary: {
        total_income: number;
        total_expense: number;
        today_income: number;
        today_expense: number;
    };
    chart: {
        date: string;
        income: number;
        expense: number;
    }[];
    latest_transactions: {
        data: Transaction[];
    };
};

type StatCardProps = {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    color: string;
};

/* ======================
   COMPONENTS
====================== */
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <Card className="h-full">
            <CardContent className="flex h-full flex-col justify-between gap-4">
                <Icon className={`h-5 w-5 ${color}`} />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    Last 30 Days
                </p>
            </CardContent>
        </Card>
    );
}

/* ======================
   PAGE
====================== */
export default function Dashboard({
    summary,
    chart,
    latest_transactions,
}: Props) {

    /* ===== CHART CONFIG ===== */
    const chartConfig = {
        income: { label: 'Income', color: '#22c55e' },
        expense: { label: 'Expense', color: '#ef4444' },
    };

    /* ===== CALCULATIONS ===== */
    const balance = summary.total_income - summary.total_expense;
    const savings =
        summary.total_income > 0
            ? ((balance / summary.total_income) * 100).toFixed(2)
            : '0.00';

    /* ===== FORMATTERS ===== */
    // Rupiah currency, English UI
    const formatCurrencyIDR = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    // Axis date (short, clean)
    const formatDateAxis = (date: string) =>
        new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
        }).format(new Date(date));

    // Tooltip date (full)
    const formatDateTooltip = (date: string) =>
        new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6">

                {/* ===== SUMMARY ===== */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Balance"
                        value={formatCurrencyIDR(balance)}
                        icon={Wallet}
                        color="text-yellow-500"
                    />
                    <StatCard
                        title="Income"
                        value={formatCurrencyIDR(summary.total_income)}
                        subtitle={`Today: ${formatCurrencyIDR(summary.today_income)}`}
                        icon={ArrowUpRight}
                        color="text-green-500"
                    />
                    <StatCard
                        title="Expense"
                        value={formatCurrencyIDR(summary.total_expense)}
                        subtitle={`Today: ${formatCurrencyIDR(summary.today_expense)}`}
                        icon={ArrowDownRight}
                        color="text-red-500"
                    />
                    <StatCard
                        title="Savings Rate"
                        value={`${savings}%`}
                        icon={PiggyBank}
                        color="text-blue-500"
                    />
                </div>

                {/* ===== CHART + TRANSACTIONS ===== */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* CHART */}
                    <Card className="xl:col-span-2">
                        <CardContent >
                            <h4 className="mb-4 text-sm font-medium">
                                Income vs Expense
                            </h4>

                            <ChartContainer
                                config={chartConfig}
                                className="min-h-[320px] w-full"
                            >
                                <BarChart data={chart}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDateAxis}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    {/* ===== TOOLTIP (FIXED) ===== */}
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(label) =>
                                                    formatDateTooltip(label)
                                                }
                                                formatter={(value) =>
                                                    formatCurrencyIDR(
                                                        Number(value)
                                                    )
                                                }
                                            />
                                        }
                                    />

                                    <ChartLegend
                                        content={<ChartLegendContent />}
                                    />

                                    <Bar
                                        dataKey="income"
                                        fill="#22c55e"
                                        radius={4}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        fill="#ef4444"
                                        radius={4}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* LATEST TRANSACTIONS */}
                    <Card>
                        <CardContent >
                            <h4 className="mb-4 text-sm font-medium">
                                Latest Transactions
                            </h4>

                            <div className="space-y-4 text-sm">
                                {latest_transactions.data.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No recent transactions
                                    </p>
                                )}

                                {latest_transactions.data.map((trx) => (
                                    <div
                                         key={`${trx.type}-${trx.id}`}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {trx.name}
                                            </p>
                                            <p className="text-xs mt-1 text-muted-foreground">
                                                {formatDateAxis(trx.date)} •{' '}
                                                {trx.type === 'income'
                                                    ? 'Income'
                                                    : 'Expense'}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 font-semibold ${
                                                trx.type === 'income'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {trx.type === 'income' ? '+' : '-'}
                                            {formatCurrencyIDR(trx.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
