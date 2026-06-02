import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, User, History, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const firstName = user.displayName?.split(' ')[0] ?? 'User';

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 10px 5px 5px',
          borderRadius: 24,
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e6edf3',
          cursor: 'pointer',
          transition: 'all 200ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
        aria-label="User menu"
      >
        {/* Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User'}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: '#F4845F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={14} style={{ color: 'white' }} />
          </div>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {firstName}
        </span>
        <ChevronDown size={13} style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 220,
          backgroundColor: 'rgba(22,27,34,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          zIndex: 100,
          backdropFilter: 'blur(16px)',
        }}>
          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F4845F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} style={{ color: 'white' }} />
                </div>
              )}
              <div style={{ overflow: 'hidden' }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName}
                </p>
                <p style={{ color: '#8b949e', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <button
            onClick={() => { setOpen(false); navigate('/history'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', background: 'none', border: 'none',
              color: '#e6edf3', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', textAlign: 'left', transition: 'background 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <History size={15} style={{ opacity: 0.7 }} />
            Interview History
          </button>

          <button
            onClick={() => { setOpen(false); navigate('/upload'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', background: 'none', border: 'none',
              color: '#e6edf3', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', textAlign: 'left', transition: 'background 150ms',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <ArrowRight size={15} style={{ opacity: 0.7 }} />
            New Interview
          </button>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 16px',
              background: 'none',
              border: 'none',
              color: '#ff6b6b',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,75,75,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
