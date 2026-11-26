import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockMessages, mockUsers } from '../data/mockData';
import { useState } from 'react';

const ChatView = ({ conversation, onBack }) => {
  const [messageText, setMessageText] = useState('');
  const messages = mockMessages[conversation.id] || [];

  const handleSend = () => {
    if (!messageText.trim()) return;
    // In real app: send message via API
    setMessageText('');
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 18, color: '#0F172A',
        }}>‹</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 14,
            }}>
              {conversation.name.split(' ').map(n => n[0]).join('')}
            </div>
            {conversation.online && (
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 12, height: 12, borderRadius: '50%',
                background: '#22C55E', border: '2px solid white',
              }} />
            )}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>{conversation.name}</p>
            <p style={{ fontSize: 12, color: conversation.online ? '#22C55E' : '#94A3B8', margin: 0 }}>
              {conversation.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: '20px', paddingBottom: 80 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <MessageCircle size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748B', fontWeight: 600 }}>No messages yet</p>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Start the conversation</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: msg.sent ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: msg.sent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sent ? 'linear-gradient(135deg, #2563EB, #4F46E5)' : '#F1F5F9',
                color: msg.sent ? 'white' : '#0F172A',
                fontSize: 14, lineHeight: 1.5,
              }}>
                {msg.text}
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>{msg.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0, maxWidth: 480, margin: '0 auto',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid #F1F5F9', padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'center', zIndex: 40,
      }}>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          border: 'none', background: '#F8FAFC', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <input
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 24,
            border: '1px solid #E2E8F0', fontSize: 14, outline: 'none',
            background: '#F8FAFC',
          }}
        />
        <button onClick={handleSend} disabled={!messageText.trim()} style={{
          width: 40, height: 40, borderRadius: '50%',
          border: 'none', background: messageText.trim() ? 'linear-gradient(135deg, #2563EB, #4F46E5)' : '#E2E8F0',
          cursor: messageText.trim() ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default function Messages() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' or chat with conversation id
  const [activeConversation, setActiveConversation] = useState(null);

  const onlineUsers = mockUsers.filter(u => u.online);
  const conversations = mockMessages.conversations || Object.keys(mockMessages).filter(k => k !== 'conversations').map(id => ({
    id, name: mockUsers.find(u => u.id === parseInt(id))?.name || 'User',
    lastMessage: mockMessages[id]?.[mockMessages[id].length - 1]?.text || '',
    time: mockMessages[id]?.[mockMessages[id].length - 1]?.time || '',
    unread: mockMessages[id]?.filter(m => !m.sent).length || 0,
    online: mockUsers.find(u => u.id === parseInt(id))?.online || false,
  }));

  if (view === 'chat' && activeConversation) {
    return <ChatView conversation={activeConversation} onBack={() => setView('list')} />;
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'white', padding: '16px 20px',
        borderBottom: '1px solid #F1F5F9',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>Messages</h1>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Online Now Section */}
        {onlineUsers.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              Online Now
            </p>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {onlineUsers.map(user => (
                <button key={user.id} onClick={() => {
                  const conv = conversations.find(c => c.id === String(user.id));
                  if (conv) { setActiveConversation(conv); setView('chat'); }
                }} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer', minWidth: 64,
                }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${user.color1 || '#2563EB'}, ${user.color2 || '#7C3AED'})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 16,
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 2, right: 2,
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#22C55E', border: '2px solid white',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversations List */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Recent Chats
        </p>
        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            <p style={{ color: '#64748B', fontWeight: 600 }}>No conversations yet</p>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Start chatting with sellers</p>
          </div>
        ) : (
          conversations.map(conv => (
            <button key={conv.id} onClick={() => { setActiveConversation(conv); setView('chat'); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 0', borderBottom: '1px solid #F1F5F9',
              background: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 16,
                }}>
                  {conv.name.split(' ').map(n => n[0]).join('')}
                </div>
                {conv.online && (
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#22C55E', border: '2px solid white',
                  }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{conv.name}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{conv.time}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <div style={{
                  minWidth: 20, height: 20, borderRadius: 10,
                  background: '#2563EB', color: 'white',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 6px', flexShrink: 0,
                }}>
                  {conv.unread}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
