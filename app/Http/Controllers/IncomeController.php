<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Income;
use Illuminate\Http\Request;
use App\Http\Resources\IncomeResource;
use App\Http\Requests\FormIncomeRequest;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('incomes/index', [
            'collection' => IncomeResource::collection(
                Income::orderBy('id', 'desc')->get()
            )
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormIncomeRequest $request)
    {
        $income = Income::create($request->validated());
        return to_route('incomes.index')->with('message', 'Income created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormIncomeRequest $request, Income $income)
    {
        $income->update($request->validated());
        return to_route('incomes.index')->with('message', 'Income updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income)
    {
        $income->delete();
        return to_route('incomes.index')->with('message', 'Income deleted successfully.');
    }
}
