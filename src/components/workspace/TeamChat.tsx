"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import LoadingSpinner from "../ui/LoadingSpinner";

type Message = { id: string, content: string, user_id: string, project_id: string, created_at: string, profiles?: { full_name: string, id: string } };

export default function TeamChat({ projectId, userId }: { projectId: string, userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel(`chat-${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, () => {
        fetchMessages(); 
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
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(full_name, id)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
    setLoading(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msgToInsert = newMessage;
    setNewMessage(""); 
    
    await supabase.from('messages').insert({
      project_id: projectId,
      user_id: userId,
      content: msgToInsert
    });
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '?';
  };

  return (
    <div className="glass-panel chat-container" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "var(--spacing-md)", borderBottom: "1px solid var(--color-border)", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></div>
          Team Chat
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "400" }}>{messages.length} messages</span>
      </div>
      
      <div className="chat-messages" style={{ flex: 1, padding: "var(--spacing-md)", overflowY: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <LoadingSpinner size="md" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "var(--spacing-xl)", fontSize: "0.9rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💬</div>
            No messages yet. Say hi to your teammates!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.user_id === userId;
            const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={msg.id} style={{ 
                display: "flex", 
                flexDirection: isMe ? "row-reverse" : "row", 
                gap: "10px", 
                marginBottom: "var(--spacing-md)",
                alignItems: "flex-end"
              }}>
                {!isMe && (
                  <div style={{ 
                    width: "32px", height: "32px", borderRadius: "50%", 
                    background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: "bold", color: "white", flexShrink: 0
                  }}>
                    {getInitials(msg.profiles?.full_name || 'User')}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  {!isMe && <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px", marginLeft: "4px" }}>{msg.profiles?.full_name}</div>}
                  <div style={{ 
                    padding: "10px 14px", 
                    borderRadius: "18px", 
                    background: isMe ? "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-primary-hover))" : "var(--color-bg-secondary)",
                    color: isMe ? "white" : "var(--color-text-primary)",
                    border: isMe ? "none" : "1px solid var(--color-border)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    borderBottomRightRadius: isMe ? "4px" : "18px",
                    borderBottomLeftRadius: isMe ? "18px" : "4px"
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "4px", padding: "0 4px" }}>{time}</div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", padding: "var(--spacing-md)", borderTop: "1px solid var(--color-border)", background: "rgba(255,255,255,0.02)", gap: "var(--spacing-sm)" }}>
        <input 
          type="text" className="input-field" 
          placeholder="Type a message..." 
          style={{ height: "42px", borderRadius: "var(--radius-full)", paddingLeft: "20px" }}
          value={newMessage} onChange={e => setNewMessage(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn btn-primary hover-scale" 
          style={{ width: "42px", height: "42px", borderRadius: "50%", padding: 0 }}
          disabled={!newMessage.trim()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
