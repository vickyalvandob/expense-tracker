import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import incomes from '@/routes/incomes';
import type { Income, IncomeCollection, BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

/* =======================
   Breadcrumb
======================= */
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incomes',
        href: incomes.index().url,
    },
];

/* =======================
   Props
======================= */
type Props = {
    collection: IncomeCollection;
};

/* =======================
   Form Type
======================= */
type IncomeForm = {
    id: number | null;
    name: string;
    amount: string;
    date: string;
};

/* =======================
   Empty Form
======================= */
const emptyForm: IncomeForm = {
    id: null,
    name: '',
    amount: '',
    date: '',
};

export default function Index({ collection }: Props) {
    /* ---------- Create / Edit Modal ---------- */
    const [open, setOpen] = useState(false);
    const { data, setData, reset, processing, errors } =
        useForm<IncomeForm>(emptyForm);

    /* ---------- Delete Confirm Dialog ---------- */
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Income | null>(null);

    /* =======================
       Open Create Modal
    ======================= */
    const openCreateModal = () => {
        reset();
        setOpen(true);
    };

    /* =======================
       Open Edit Modal
    ======================= */
    const openEditModal = (income: Income) => {
        setData({
            id: income.id,
            name: income.name,
            amount: String(income.amount),
            date: income.date,
        });
        setOpen(true);
    };

    /* =======================
       Close Modal
    ======================= */
    const closeModal = () => {
        setOpen(false);
        reset();
    };

    /* =======================
       Submit (Create / Update)
    ======================= */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.id) {
            // UPDATE
            router.put(`/incomes/${data.id}`, data, {
                onSuccess: closeModal,
            });
        } else {
            // CREATE
            router.post('/incomes', data, {
                onSuccess: closeModal,
            });
        }
    };

    /* =======================
       Open Delete Dialog
    ======================= */
    const openDeleteDialog = (income: Income) => {
        setDeleteItem(income);
        setDeleteOpen(true);
    };

    /* =======================
       Confirm Delete
    ======================= */
    const confirmDelete = () => {
        if (!deleteItem) return;

        router.delete(`/incomes/${deleteItem.id}`, {
            onSuccess: () => {
                setDeleteOpen(false);
                setDeleteItem(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incomes" />

            {/* ===== Title & Action ===== */}
            <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="text-xl font-semibold">Income List</h1>

                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income
                </Button>
            </div>

            {/* ===== Table ===== */}
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Income Source</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {collection.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No income data available
                                </TableCell>
                            </TableRow>
                        )}

                        {collection.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(item.amount)}
                                </TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="text-end space-x-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Edit"
                                        onClick={() => openEditModal(item)}
                                    >
                                        <Pencil size={16} />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Delete"
                                        className="text-red-600"
                                        onClick={() => openDeleteDialog(item)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ===== Create / Edit Modal ===== */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id ? 'Edit Income' : 'Add New Income'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                                <Label>Income Source</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label>Amount</Label>
                                    <Input
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData('amount', e.target.value)
                                        }
                                    />
                                    {errors.amount && (
                                        <p className="text-sm text-red-600">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-red-600">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : data.id
                                    ? 'Update'
                                    : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== Delete Confirm Dialog ===== */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>

                    {deleteItem && (
                       <div className="space-y-4 text-sm">
                            {/* Info Card */}
                            <div className="rounded-lg border bg-background p-4 ">
                                <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                                    <span className="text-muted-foreground">Source</span>
                                    <span className="col-span-2 font-medium">
                                        {deleteItem.name}
                                    </span>

                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="col-span-2 font-semibold text-emerald-600">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(deleteItem.amount)}
                                    </span>

                                    <span className="text-muted-foreground">Date</span>
                                    <span className="col-span-2">
                                        {deleteItem.date}
                                    </span>
                                </div>
                            </div>

                            {/* Warning Box */}
                            <div className="rounded-md border px-4 py-3 text-red-700">
                            <p className="text-red-600 font-medium">
                                    Are you sure you want to delete this income?
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                    )}

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
