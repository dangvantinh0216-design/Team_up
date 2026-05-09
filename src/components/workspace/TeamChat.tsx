"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

type Message = { id: string, content: string, user_id: string, project_id: string, created_at: string, profiles?: { full_name: string, id: string } };

export default function TeamChat({ projectId, userId }: { projectId: string, userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('chat-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, () => {
        fetchMessages(); // re-fetch to get joined profile data easily
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    // Join with profiles table to get the sender's name
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(full_name, id)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msgToInsert = newMessage;
    setNewMessage(""); // Clear early for better UX
    
    await supabase.from('messages').insert({
      project_id: projectId,
      user_id: userId,
      content: msgToInsert
    });
  };

  return (
    <div className="glass-panel chat-container">
      <div style={{ padding: "var(--spacing-md)", borderBottom: "1px solid var(--color-border)", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></div>
        Team Chat
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "var(--spacing-lg)", fontSize: "0.9rem" }}>
            No messages yet. Say hi to your team! 👋
          </div>
        )}
        
        {messages.map(msg => {
          const isMe = msg.user_id === userId;
          return (
            <div key={msg.id} className={`chat-msg ${isMe ? 'msg-sent' : 'msg-received'}`}>
              {!isMe && <div className="msg-author">{msg.profiles?.full_name || 'Teammate'}</div>}
              <div>{msg.content}</div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", padding: "var(--spacing-sm)", borderTop: "1px solid var(--color-border)", background: "rgba(0,0,0,0.1)" }}>
        <input 
          type="text" className="input-field" 
          placeholder="Type a message..." 
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, border: "none", background: "rgba(255,255,255,0.03)", padding: "10px 15px", height: "40px" }}
          value={newMessage} onChange={e => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>Send</button>
      </form>
    </div>
  );
}
