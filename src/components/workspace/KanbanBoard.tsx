"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/ToastContext";

type Task = { id: string, title: string, status: string, assigned_to: string, project_id: string, created_at: string };

export default function KanbanBoard({ projectId, userId }: { projectId: string, userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    fetchTasks();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
    if (data) setTasks(data);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const { error } = await supabase.from('tasks').insert({
      project_id: projectId,
      title: newTaskTitle,
      status: 'todo',
      assigned_to: userId
    });

    if (!error) {
      showToast("Công việc mới đã được thêm! 📝", "success");
      setNewTaskTitle("");
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);

    if (error) {
      showToast("Lỗi khi cập nhật trạng thái.", "error");
      return;
    }

    if (newStatus === 'done') {
      setRewardMsg("+5 Điểm Uy Tín! 🌟");
      setTimeout(() => setRewardMsg(null), 3000);
      showToast("Tuyệt vời! Bạn đã hoàn thành công việc. 🚀", "success");

      await supabase.from('notifications').insert({
        user_id: userId,
        actor_id: userId,
        type: 'score',
        content: `Bạn vừa được cộng +5 điểm Uy tín cho việc hoàn thành task! 🚀`,
        project_id: projectId
      });

      const { data: profile } = await supabase.from('profiles').select('reliability_score').eq('id', userId).single();
      if (profile) {
        const newScore = (profile.reliability_score || 100) + 5;
        await supabase.from('profiles').update({ reliability_score: newScore }).eq('id', userId);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (!error) {
        showToast("Đã xóa công việc.", "info");
      }
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      
      {rewardMsg && (
        <div className="animate-fade-in" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10,
          background: "linear-gradient(135deg, var(--color-success), #059669)", color: "white",
          padding: "var(--spacing-md) var(--spacing-xl)", borderRadius: "var(--radius-full)",
          fontWeight: "bold", fontSize: "1.2rem", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.5)",
          pointerEvents: "none"
        }}>
          {rewardMsg}
        </div>
      )}

      <form onSubmit={addTask} style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
        <input 
          type="text" className="input-field" 
          placeholder="New task... (e.g. Design Landing Page)" 
          value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>Add Task</button>
      </form>

      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.id} className="kanban-col">
            <div className="kanban-col-header">
              {col.title}
              <span style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", flex: 1, overflowY: "auto", paddingRight: "4px" }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="kanban-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: "0.95rem", marginBottom: "var(--spacing-sm)", fontWeight: "500" }}>{task.title}</p>
                    <button onClick={() => deleteTask(task.id)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "1.2rem", padding: "0 4px" }}>×</button>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--spacing-sm)" }}>
                    {col.id === 'todo' && (
                      <button onClick={() => updateTaskStatus(task.id, 'in_progress')} className="btn btn-outline" style={{ padding: "2px 10px", fontSize: "0.75rem", width: "100%" }}>Start</button>
                    )}
                    {col.id === 'in_progress' && (
                      <>
                        <button onClick={() => updateTaskStatus(task.id, 'todo')} className="btn btn-outline" style={{ padding: "2px 8px", fontSize: "0.75rem" }}>Back</button>
                        <button onClick={() => updateTaskStatus(task.id, 'done')} className="btn btn-primary" style={{ padding: "2px 8px", fontSize: "0.75rem" }}>Complete</button>
                      </>
                    )}
                    {col.id === 'done' && (
                      <button onClick={() => updateTaskStatus(task.id, 'in_progress')} className="btn btn-outline" style={{ padding: "2px 10px", fontSize: "0.75rem", width: "100%" }}>Reopen</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
