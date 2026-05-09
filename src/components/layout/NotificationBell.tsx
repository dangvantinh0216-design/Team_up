"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

type Notification = {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setNotifications(data);
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (unreadCount === 0) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleToggle = () => {
    if (!isOpen) {
      markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        style={{ 
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", 
          cursor: "pointer", position: "relative", color: "white", padding: "8px",
          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s"
        }}
        className="btn-hover-effect"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{ 
            position: "absolute", top: "-2px", right: "-2px", 
            backgroundColor: "var(--color-danger)", color: "white", 
            borderRadius: "50%", minWidth: "18px", height: "18px", 
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: "bold", border: "2px solid var(--color-bg-primary)"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{ 
          position: "absolute", top: "120%", right: 0, width: "320px", 
          maxHeight: "450px", overflowY: "auto", zIndex: 1000, 
          padding: "0", borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)", border: "1px solid var(--color-border)"
        }}>
          <div style={{ padding: "var(--spacing-md)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>Notifications</h4>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Latest Activity</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            {notifications.length === 0 && (
              <div style={{ padding: "var(--spacing-xl)", textAlign: "center" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>No notifications yet. 👋</p>
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} style={{ 
                padding: "14px var(--spacing-md)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: n.is_read ? "transparent" : "rgba(99, 102, 241, 0.05)",
                display: "flex", gap: "12px"
              }}>
                <div style={{ 
                  width: "8px", height: "8px", borderRadius: "50%", 
                  backgroundColor: n.is_read ? "transparent" : "var(--color-brand-primary)",
                  marginTop: "6px", flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", lineHeight: "1.4", margin: "0 0 6px 0", color: n.is_read ? "var(--color-text-secondary)" : "var(--color-text-primary)" }}>
                    {n.content}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                    {new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
