"use client";
import { useTasks } from "../../../lib/hooks/useTasks";
import { useEmployees } from "../../../lib/hooks/useEmployees";
import { useAuth, useDashboardProtection } from "../../../lib/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, CheckCircle, Clock, PlayCircle } from "lucide-react";

export default function TasksPage() {
  useDashboardProtection(["superadmin", "admin"]);
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const { employees } = useEmployees();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", status: "pending" });
  const [formError, setFormError] = useState("");

  // Helper function to render status badge with icon and color
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        label: "Pending",
        className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
        iconColor: "text-amber-600"
      },
      "in-progress": {
        icon: Loader2,
        label: "In Progress",
        className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        iconColor: "text-blue-600"
      },
      completed: {
        icon: CheckCircle,
        label: "Completed",
        className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
        iconColor: "text-green-600"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <IconComponent 
          className={`h-3 w-3 mr-1 ${config.iconColor} ${status === 'in-progress' ? 'animate-spin' : ''}`} 
        />
        {config.label}
      </Badge>
    );
  };

  useEffect(() => {
    console.log('Tasks loaded:', tasks.length);
    console.log('Employees loaded:', employees.length);
    console.log('Tasks:', tasks);
    console.log('Employees:', employees);
  }, [tasks, employees]);

  const handleOpenAdd = () => {
    setEditTask(null);
    setForm({ title: "", description: "", assignedTo: "", status: "pending" });
    setFormError("");
    setOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, assignedTo: task.assignedTo, status: task.status });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setFormError("");
    
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!form.assignedTo) {
      setFormError("Please select an employee to assign the task");
      return;
    }
    
    try {
      const taskData = {
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        status: form.status
      };
      
      if (editTask) {
        await updateTask(editTask._id, taskData);
        toast.success("Task updated successfully");
      } else {
        await addTask(taskData);
        toast.success("Task added successfully");
      }
      handleClose();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save task");
      toast.error(err?.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await deleteTask(_id);
      toast.success("Task deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {isSuperAdmin && (
          <Button onClick={handleOpenAdd}>Add Task</Button>
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <TableSkeleton rows={5} columns={4} showActions={isSuperAdmin} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 5 : 4}>No tasks found.</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {(() => {
                      const assignedEmployee = employees.find((e) => e._id === task.assignedTo);
                      console.log('Task:', task.title, 'AssignedTo ID:', task.assignedTo, 'Found Employee:', assignedEmployee);
                      return assignedEmployee?.name || "Unassigned";
                    })()}
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(task.status)}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(task)} className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(task._id)}>Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editTask ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Enter task title"
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Enter task description"
                rows={3}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select value={form.assignedTo} onValueChange={(value) => handleSelectChange('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <SelectItem key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees" disabled>
                      No employees available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
              {editTask ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 