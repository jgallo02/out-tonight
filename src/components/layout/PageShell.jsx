import BottomNav from './BottomNav'

export default function PageShell({ children, hideNav = false }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0c1538',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        overflowY: 'auto',
      }}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}
