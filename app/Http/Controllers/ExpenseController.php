<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Expense;
use Illuminate\Http\Request;
use App\Http\Requests\FormExpenseRequest;
use App\Http\Resources\ExpenseResource;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('expenses/index', [
            'collection' => ExpenseResource::collection(
                Expense::orderBy('id', 'desc')->get()
            ),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormExpenseRequest $request)
    {
        Expense::create($request->validated());

        return to_route('expenses.index')
            ->with('message', 'Expense created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());

        return to_route('expenses.index')
            ->with('message', 'Expense updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();

        return to_route('expenses.index')
            ->with('message', 'Expense deleted successfully.');
    }
}
