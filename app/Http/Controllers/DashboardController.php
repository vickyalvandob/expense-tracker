<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Income;
use App\Models\Expense;
use App\Http\Resources\ExpenseResource;
use App\Http\Resources\IncomeResource;

class DashboardController extends Controller
{
    public function index()
    {
        $from = Carbon::now()->subDays(30);

        /* ======================
           SUMMARY
        ====================== */
        $totalIncome  = Income::where('date', '>=', $from)->sum('amount');
        $totalExpense = Expense::where('date', '>=', $from)->sum('amount');

        $todayIncome  = Income::whereDate('date', today())->sum('amount');
        $todayExpense = Expense::whereDate('date', today())->sum('amount');

        /* ======================
           CHART (Income vs Expense per day)
        ====================== */
        $incomePerDay = Income::selectRaw('DATE(date) as date, SUM(amount) as total')
            ->where('date', '>=', $from)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $expensePerDay = Expense::selectRaw('DATE(date) as date, SUM(amount) as total')
            ->where('date', '>=', $from)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chart = collect();

        foreach ($incomePerDay as $date => $income) {
            $chart->push([
                'date'    => Carbon::parse($date)->toISOString(),
                'income'  => (float) $income->total,
                'expense' => (float) ($expensePerDay[$date]->total ?? 0),
            ]);
        }

        /* ======================
           LATEST TRANSACTIONS
        ====================== */
        $latestIncomes = Income::latest('date')
            ->take(5)
            ->get()
            ->map(fn ($i) => [
                'id'     => $i->id,
                'name'   => $i->name,
                'amount' => (float) $i->amount,
                'date'   => $i->date->toISOString(),
                'type'   => 'income',
            ]);

        $latestExpenses = Expense::latest('date')
            ->take(5)
            ->get()
            ->map(fn ($e) => [
                'id'     => $e->id,
                'name'   => $e->name,
                'amount' => (float) $e->amount,
                'date'   => $e->date->toISOString(),
                'type'   => 'expense',
            ]);

        $latestTransactions = $latestIncomes
            ->merge($latestExpenses)
            ->sortByDesc('date')
            ->take(8)
            ->values();

        /* ======================
           RESPONSE
        ====================== */
        return Inertia::render('dashboard', [
            'summary' => [
                'total_income'  => $totalIncome,
                'total_expense' => $totalExpense,
                'today_income'  => $todayIncome,
                'today_expense' => $todayExpense,
            ],

            'chart' => $chart,

            'latest_transactions' => [
                'data' => $latestTransactions,
            ],
        ]);
    }
}
