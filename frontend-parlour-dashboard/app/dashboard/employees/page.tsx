"use client";
import { useEmployees } from "../../../lib/hooks/useEmployees";
import { useAuth, useDashboardProtection } from "../../../lib/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/skeletons";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function EmployeesPage() {
  useDashboardProtection(["superadmin", "admin"]);
  const { employees, loading, error, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [open, setOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "employee" });
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setEditEmployee(null);
    setForm({ name: "", email: "", role: "employee" });
    setOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditEmployee(emp);
    setForm({ name: emp.name, email: emp.email, role: emp.role });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditEmployee(null);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async () => {
    setFormError("");
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee._id, form);
        toast.success("Employee updated successfully");
      } else {
        await addEmployee(form);
        toast.success("Employee added successfully");
      }
      handleClose();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save employee");
      toast.error(err?.response?.data?.message || "Failed to save employee");
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await deleteEmployee(_id);
      toast.success("Employee deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        {isSuperAdmin && (
          <Button onClick={handleOpenAdd}>Add Employee</Button>
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <TableSkeleton rows={5} columns={3} showActions={isSuperAdmin} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {isSuperAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 4 : 3}>No employees found.</TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(emp)} className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(emp._id)}>Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter employee name"
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter email address"
                type="email"
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border">
                {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editEmployee ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 