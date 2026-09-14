"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <Card size="sm" className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-sm">{task.title}</CardTitle>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="justify-end gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <Pencil />
          編集
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(task)}
        >
          <Trash2 />
          削除
        </Button>
      </CardFooter>
    </Card>
  );
}
