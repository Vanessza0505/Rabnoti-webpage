import { useState, useEffect } from 'react'
import heroImg from './assets/LOGO.jpg'
import './App.css'

const API = 'http://89.132.67.235:3000'
const CAESAR_ENCODED = 'yruujwpó töwhecáa wjybdpáa namő lbruujp oxuhó kjaácbáp áuxv tnwhéa erqja cütöa biéu öaöv qxum tjujwm'
const CAESAR_ANSWER  = 'pillangó könyvtár napsugár erdő csillag folyó barátság álom kenyér vihar tükör szél öröm hold kaland'

async function fetchTaksSolved(roomcode) {
  const res = await fetch(`${API}/tasks_solved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: Number(roomcode) })
  })
  const data = await res.json()
  console.log('taks_solved:', data.taks_solved)
  return data.taks_solved
}

async function postUpdateTasks(roomcode) {
  const res = await fetch(`${API}/update_tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: Number(roomcode) })
  })
  const data = await res.json()
  console.log('update_tasks válasz:', data)
  return data
}

function DropdownItem({ label, items }) {
  const [open, setOpen] = useState(false)
  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-[5px] px-3 py-[14px] text-[16px] lg:text-[18px] font-medium text-white hover:text-blue-400 transition-colors whitespace-nowrap">
        {label} <i className="fas fa-chevron-down text-[9px] mt-px"></i>
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-black border border-gray-200 shadow-lg rounded-sm min-w-[180px] z-[100]">
          {items.map((item, i) => (
            <a key={i} href="#" className="block px-4 py-2 text-[14px] text-white hover:bg-blue-100 hover:text-black">
              {item}
            </a>
          ))}
        </div>
      )}
    </li>
  )
}

function MobileMenu({ open }) {
  const navSections = [
    { label: 'Rólunk', items: ['Történet','Bemutatkozás','Munkatársak','Oktatók','Nyitvatartás, csengetési rend','Elérhetőségek','Galéria','Karrier','Radnóti Alumni','Leendő kilencedikeseknek'] },
    { label: 'Tanulóinknak', items: ['Hasznos tudnivalók','Események, iskolai napok','Tanév rendje','Tantárgyi menetrendek','Egyéb foglalkozások','Órarend','Adatkezelési tájékoztató- nyilatkozat tanulóknak','Tanárok fogadóórája','Szakmai vizsga - vizsgaközpont','Érettségi témakörök','Közösségi szolgálat'] },
    { label: 'Hírek', items: [] },
    { label: 'Képzéseink', items: ['Technikumi és szakképző iskolai oktatás','Felnőttek nappali rendszerű szakmai oktatása','Felnőttek szakmai oktatása','Szakmai képzéseink','Egyéb képzéseink','Duális partnerek','Díjak, kedvezmények'] },
    { label: 'Szakmai dokumentumok', items: ['Szakmai program','Képzési program','KKK/PTT','Külső értékelések, összegző jelentések','Vezetési program','SZMSZ','Házirend','Tűzvédelmi szabályzat és menekülési útvonal','Munkavédelmi szabályzat','Eljárásrend a tanulók bántalmazási eseteinek kivizsgálására és kezelésére'] },
    { label: 'Projektek', items: ['Projektek','Széchenyi 2020 projektek'] },
    { label: 'Közérdekű adatok', items: [] },
  ]

  const [openSection, setOpenSection] = useState(null)

  if (!open) return null
  return (
    <div className="bg-gray-950 border-t border-gray-800 px-4 py-3 flex flex-col gap-1">
      {navSections.map((s, i) => (
        <div key={i}>
          <button
            className="w-full text-left px-3 py-2 text-[16px] font-medium text-white hover:text-blue-400 transition-colors flex items-center justify-between"
            onClick={() => setOpenSection(openSection === i ? null : i)}
          >
            {s.label}
            {s.items.length > 0 && <i className={`fas fa-chevron-down text-[10px] transition-transform ${openSection === i ? 'rotate-180' : ''}`}></i>}
          </button>
          {openSection === i && s.items.length > 0 && (
            <div className="pl-4 flex flex-col">
              {s.items.map((item, j) => (
                <a key={j} href="#" className="py-1 text-[14px] text-gray-400 hover:text-white">{item}</a>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-3 mt-2 px-3">
        <a href="https://www.e-kreta.hu/" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded text-[14px]">Kréta</a>
        <a href="https://www.microsoft.com/hu-hu/microsoft-teams/log-in" className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-1 px-3 border border-purple-500 hover:border-transparent rounded text-[14px]">Teams</a>
      </div>
    </div>
  )
}

function Puzzle1({ roomcode, onDone }) {
  const W1 = 'LOCK', W2 = 'CODE'

  function makeTiles(letters) {
    const arr = [...letters.map((ch, i) => ({ ch, id: 'c' + i, zone: 'pool', order: i }))]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const [screen, setScreen] = useState('image')
  const [tiles, setTiles] = useState(() => makeTiles([...W1, ...W2]))
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  function moveTile(id, toZone) {
    setTiles(prev => {
      const zoneCount = prev.filter(t => t.zone === toZone).length
      return prev.map(t => t.id === id ? { ...t, zone: toZone, order: zoneCount } : t)
    })
    setFeedback('')
  }

  async function checkAnswer() {
    const poolLeft = tiles.filter(t => t.zone === 'pool').length
    if (poolLeft > 0) { setFeedback('Helyezz el minden betűt!'); return }

    const get = z => tiles.filter(t => t.zone === z).sort((a, b) => a.order - b.order).map(t => t.ch).join('')
    const z1 = get('z1'), z2 = get('z2')
    const ok = (z1 === W1 && z2 === W2) || (z1 === W2 && z2 === W1)

    if (!ok) { console.log('nem'); setFeedback('✗ Nem jó, próbáld újra! (a sorrend is számít!)'); return }

    setLoading(true)
    setFeedback('Ellenőrzés...')

    try {
      const val = await fetchTaksSolved(roomcode)
      console.log('taks_solved ELŐTTE:', val)
      if (val !== 1) {
        setFeedback('✗ A fizikai feladat még nem lett megoldva!')
        setLoading(false)
        return
      }
      await postUpdateTasks(roomcode)
      const after = await fetchTaksSolved(roomcode)
      console.log('good — taks_solved UTÁNA:', after)
      setFeedback('✓ Helyes!')
      setLoading(false)
      setTimeout(onDone, 800)
    } catch (err) {
      console.error('API hiba:', err)
      setFeedback('✗ Hálózati hiba, próbáld újra!')
      setLoading(false)
    }
  }

  if (screen === 'image') return (
    <div className="flex flex-col items-center gap-6 py-8 px-2">
      <svg viewBox="0 0 280 200" className="w-[200px] sm:w-[260px] rounded-xl border border-gray-700">
        <rect width="280" height="200" rx="14" fill="#111827"/>
        <rect x="78" y="22" width="124" height="162" rx="5" fill="#374151"/>
        <rect x="82" y="26" width="116" height="154" rx="4" fill="#1f2937"/>
        <rect x="92" y="36" width="96" height="56" rx="3" fill="#111827"/>
        <rect x="92" y="102" width="96" height="56" rx="3" fill="#111827"/>
        <rect x="120" y="83" width="40" height="30" rx="6" fill="#BA7517"/>
        <path d="M129 83 L129 71 Q140 58 151 71 L151 83" fill="none" stroke="#BA7517" strokeWidth="6.5" strokeLinecap="round"/>
        <circle cx="140" cy="95" r="5" fill="#1f2937"/>
        <rect x="138" y="96" width="4" height="9" fill="#1f2937"/>
        <text x="26" y="90" fontSize="38" fill="#6b7280">?</text>
        <text x="222" y="148" fontSize="30" fill="#6b7280">?</text>
        <text x="26" y="185" fontSize="13" fill="#6b7280">1. feladat</text>
      </svg>
      <h2 className="text-[22px] sm:text-[28px] font-bold text-white text-center">1. Feladat — Anagram</h2>
      <p className="text-gray-400 text-[16px] sm:text-[18px] text-center max-w-md px-2">Két szó van összekeverve. Húzd szét őket a megfelelő helyre!</p>
      <button onClick={() => setScreen('puzzle')} className="h-12 sm:h-14 px-10 sm:px-16 bg-transparent hover:bg-green-600 text-green-400 hover:text-white text-[18px] sm:text-[20px] font-semibold border border-green-600 hover:border-transparent rounded-xl transition-all duration-200">
        Kezdjük
      </button>
    </div>
  )

  const renderZone = (zoneId) => (
    <div
      className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); moveTile(e.dataTransfer.getData('text'), zoneId) }}
    >
      {tiles.filter(t => t.zone === zoneId).sort((a, b) => a.order - b.order).map(t => (
        <div key={t.id} draggable onDragStart={e => e.dataTransfer.setData('text', t.id)}
          className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center text-[20px] sm:text-[22px] font-semibold text-white bg-gray-800 border border-gray-600 rounded-lg cursor-grab hover:-translate-y-1 transition-transform select-none">
          {t.ch}
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-5 py-6 w-full max-w-lg mx-auto px-2">
      <h2 className="text-[22px] sm:text-[28px] font-bold text-white text-center">1. Feladat — Anagram</h2>
      <p className="text-gray-400 text-[15px] sm:text-[16px] text-center">Húzd a betűket a két szóhoz — a sorrend számít!</p>
      <div className="w-full">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Betűk</p>
        {renderZone('pool')}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        <div><p className="text-gray-500 text-xs uppercase tracking-widest mb-2">1. szó</p>{renderZone('z1')}</div>
        <div><p className="text-gray-500 text-xs uppercase tracking-widest mb-2">2. szó</p>{renderZone('z2')}</div>
      </div>
      <button onClick={checkAnswer} disabled={loading}
        className="w-full h-12 sm:h-14 bg-transparent hover:bg-blue-600 text-blue-400 hover:text-white text-[16px] sm:text-[18px] font-semibold border border-blue-600 hover:border-transparent rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Ellenőrzés...' : 'Ellenőrzés'}
      </button>
      {feedback && (
        <p className={`text-[16px] sm:text-[18px] font-semibold text-center ${feedback.startsWith('✓') ? 'text-green-400' : feedback === 'Ellenőrzés...' ? 'text-gray-400' : 'text-red-400'}`}>
          {feedback}
        </p>
      )}
    </div>
  )
}

function Puzzle2({ roomcode, onDone }) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function handleTovabb() {
    setLoading(true)
    try {
      await postUpdateTasks(roomcode)
      const after = await fetchTaksSolved(roomcode)
      console.log('good — taks_solved UTÁNA:', after)
      setLoading(false)
      onDone()
    } catch (err) {
      console.error('API hiba:', err)
      setFeedback('✗ Hálózati hiba, próbáld újra!')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 w-full max-w-2xl mx-auto px-2 text-center">
      <h2 className="text-[22px] sm:text-[28px] font-bold text-white">2. Feladat — Caesar-rejtjel</h2>
      <p className="text-gray-400 text-[16px] sm:text-[18px]">Add át ezt a feladatot a csapattársadnak a valóságban!</p>

      <div className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 text-left">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Titkosított szöveg (9-cel eltolva)</p>
        <p className="text-[15px] sm:text-[18px] text-amber-400 font-mono leading-relaxed break-words">{CAESAR_ENCODED}</p>
      </div>

 
      {feedback && <p className="text-red-400 text-[15px] sm:text-[16px] font-semibold">{feedback}</p>}

      <button onClick={handleTovabb} disabled={loading}
        className="h-12 sm:h-14 px-10 sm:px-16 bg-transparent hover:bg-green-600 text-green-400 hover:text-white text-[18px] sm:text-[20px] font-semibold border border-green-600 hover:border-transparent rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Küldés...' : 'Átadtam, tovább!'}
      </button>
    </div>
  )
}

function WaitingScreen({ message }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 sm:py-20">
      <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-400 rounded-full animate-spin"></div>
      <p className="text-gray-400 text-[18px] sm:text-[22px] text-center px-4">{message}</p>
    </div>
  )
}

function EscapedScreen() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center px-4">
      <h1 className="text-[36px] sm:text-[48px] font-bold text-green-400 tracking-tight">Kiszabadultatok!</h1>
      <p className="text-gray-400 text-[18px] sm:text-[22px]">Gratulálunk, megoldottátok a szabadulószobát!</p>
    </div>
  )
}

function GameView({ roomcode }) {
  const [phase, setPhase] = useState('puzzle1')

  useEffect(() => {
    if (phase !== 'waiting3' && phase !== 'waiting5') return
    const interval = setInterval(async () => {
      try {
        const val = await fetchTaksSolved(roomcode)
        if (phase === 'waiting3' && val >= 3) setPhase('puzzle2')
        if (phase === 'waiting5' && val >= 5) setPhase('escaped')
      } catch (e) { console.error('polling hiba:', e) }
    }, 2000)
    return () => clearInterval(interval)
  }, [phase, roomcode])

  if (phase === 'puzzle1')  return <Puzzle1 roomcode={roomcode} onDone={() => setPhase('waiting3')} />
  if (phase === 'waiting3') return <WaitingScreen message="Várd a következő feladatot..." />
  if (phase === 'puzzle2')  return <Puzzle2 roomcode={roomcode} onDone={() => setPhase('waiting5')} />
  if (phase === 'waiting5') return <WaitingScreen message="Várd a csapattársadat..." />
  if (phase === 'escaped')  return <EscapedScreen />
  return null
}

function App() {
  const [username, setUsername] = useState("")
  const [roomcode, setRoomCode] = useState("")
  const [start, setIsStarted] = useState(false)
  const [join, setIsJoined] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function StartButton() { setIsStarted(true) }

  async function JoinButton() {
    setJoinError('')
    if (username.trim() === '') { setJoinError('A felhasználónév nem lehet üres!'); return }
    if (username.includes(' ')) { setJoinError('A felhasználónév nem tartalmazhat szóközt!'); return }
    if (!/^\d{6}$/.test(roomcode)) { setJoinError('A szoba kód pontosan 6 számjegyből kell álljon!'); return }

    console.log("Küldés...", username, roomcode)
    try {
      const response = await fetch(`${API}/front_end_join_room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: Number(roomcode), user_2: username })
      })
      console.log("Status:", response.status)
      const data = await response.json()
      console.log("Válasz:", data)
      if (response.ok) { setIsJoined(true) }
      else { setJoinError('Sikertelen csatlakozás. Ellenőrizd a szoba kódot!') }
    } catch (error) {
      console.error("HIBA:", error)
      setJoinError('Hálózati hiba, próbáld újra!')
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <header>
        {/* 1. rész */}
        <div className="bg-black text-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3">
            <h1 className="text-[22px] sm:text-[32px] lg:text-[40px] font-semibold text-center leading-tight">Baranya Vármegyei Rabnóti</h1>
          </div>
        </div>

        {/* 2. rész */}
        <div className="border-b border-gray-900 bg-gray-950">
          <div className="mx-auto px-4 sm:px-6 py-[10px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="font-semibold text-blue-400 text-[14px] sm:text-[20px] lg:text-[25px] whitespace-nowrap">Szabadulj ki az iskolából!</h2>
              <h2 className="text-white text-[13px] sm:text-[18px] lg:text-[25px] hidden sm:block">Sok sikert és jó játékot kívánunk!</h2>
            </div>
            <a href="https://www.youtube.com/@PecsRabnoti" target="_blank" rel="noopener noreferrer" title="YouTube csatorna"
              className="text-gray-400 hover:text-[#FF0000] transition-colors text-[18px] sm:text-[20px] flex-shrink-0">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* 3. rész */}
        <div className="pt-5 sm:pt-7 pb-4 sm:pb-5">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex justify-center">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] lg:w-[150px] lg:h-[150px] border border-gray-200 shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-900">
                <img src={heroImg} alt="Éjszaka a Rabnótiban logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-[20px] sm:text-[28px] lg:text-[35px] font-bold text-white leading-[1.3]">Éjszaka a Rabnótiban</h1>
              </div>
            </div>
          </div>
        </div>

        {/* 4. rész - Nav desktop */}
        <nav className="border-b border-gray-900 bg-gray-950">
          <div className="max-w-screen-xl mx-auto px-4">
            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center">
              <DropdownItem label="Rólunk" items={['Történet','Bemutatkozás','Munkatársak','Oktatók','Nyitvatartás, csengetési rend','Elérhetőségek','Galéria','Karrier','Radnóti Alumni','Leendő kilencedikeseknek']} />
              <DropdownItem label="Tanulóinknak" items={['Hasznos tudnivalók','Események, iskolai napok','Tanév rendje','Tantárgyi menetrendek','Egyéb foglalkozások','Órarend','Adatkezelési tájékoztató- nyilatkozat tanulóknak','Tanárok fogadóórája','Szakmai vizsga - vizsgaközpont','Érettségi témakörök','Közösségi szolgálat']} />
              <li><button className="block px-3 py-[14px] text-[16px] lg:text-[18px] font-medium text-white hover:text-blue-400 transition-colors whitespace-nowrap">Hírek</button></li>
              <DropdownItem label="Képzéseink" items={['Technikumi és szakképző iskolai oktatás','Felnőttek nappali rendszerű szakmai oktatása','Felnőttek szakmai oktatása','Szakmai képzéseink','Egyéb képzéseink','Duális partnerek','Díjak, kedvezmények']} />
              <DropdownItem label="Szakmai dokumentumok" items={['Szakmai program','Képzési program','KKK/PTT','Külső értékelések, összegző jelentések','Vezetési program','SZMSZ','Házirend','Tűzvédelmi szabályzat és menekülési útvonal','Munkavédelmi szabályzat','Eljárásrend a tanulók bántalmazási eseteinek kivizsgálására és kezelésére']} />
              <DropdownItem label="Projektek" items={['Projektek','Széchenyi 2020 projektek']} />
              <li><button className="block px-3 py-[14px] text-[16px] lg:text-[18px] font-medium text-white hover:text-blue-400 transition-colors whitespace-nowrap">Közérdekű adatok</button></li>
              <li className="ml-auto mr-2">
                <a href="https://www.e-kreta.hu/" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded text-[14px]">Kréta</a>
              </li>
              <li>
                <a href="https://www.microsoft.com/hu-hu/microsoft-teams/log-in" className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-3 border border-purple-500 hover:border-transparent rounded text-[14px]">Teams</a>
              </li>
            </ul>

            {/* Mobile nav toggle */}
            <div className="flex lg:hidden items-center justify-between py-3">
              <span className="text-white text-[16px] font-medium">Menü</span>
              <button onClick={() => setMobileMenuOpen(o => !o)} className="text-white p-2">
                {mobileMenuOpen
                  ? <i className="fas fa-times text-[20px]"></i>
                  : <i className="fas fa-bars text-[20px]"></i>
                }
              </button>
            </div>
          </div>
        </nav>

        <MobileMenu open={mobileMenuOpen} />
        <div className="w-full h-[1px] bg-white opacity-50"></div>
      </header>

      {/* Main */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl p-5 sm:p-8 lg:p-10">

          {join == true ? (
            <GameView roomcode={roomcode} />

          ) : start == true ? (
            <div className="flex flex-col items-center gap-8 sm:gap-10 py-4 sm:py-6">
              <div className="text-center">
                <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-bold text-white tracking-tight mb-2">Csatlakozás a játékhoz</h1>
                <p className="text-[16px] sm:text-[20px] lg:text-[25px] text-gray-400">Töltsd ki az adatokat a belépéshez</p>
              </div>
              <div className="w-full max-w-sm flex flex-col gap-5 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold text-gray-400 uppercase tracking-widest">Felhasználónév</label>
                  <input
                    type="text"
                    className="w-full h-12 sm:h-14 px-4 text-[16px] sm:text-[18px] text-white bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                    placeholder="pl. MagyarPeter"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setJoinError('') }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold text-gray-400 uppercase tracking-widest">Szoba kód</label>
                  <input
                    type="number"
                    className="w-full h-12 sm:h-14 px-4 text-[16px] sm:text-[18px] text-white bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                    placeholder="123456"
                    value={roomcode}
                    onChange={e => { setRoomCode(e.target.value); setJoinError('') }}
                  />
                </div>
                {joinError && (
                  <p className="text-red-400 text-[14px] sm:text-[16px] font-semibold">{joinError}</p>
                )}
                <button onClick={JoinButton}
                  className="w-full h-12 sm:h-14 mt-1 bg-transparent hover:bg-green-600 text-green-400 hover:text-white text-[17px] sm:text-[20px] font-semibold border border-green-600 hover:border-transparent rounded-xl transition-all duration-200">
                  Csatlakozás a játékhoz
                </button>
              </div>
            </div>

          ) : (
            <div className="flex flex-col items-center gap-6 sm:gap-8 py-4 sm:py-6 text-center max-w-2xl mx-auto px-2">
              <div>
                <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-bold text-white tracking-tight mb-4">Üdvözlünk a játékunkban!</h1>
                <p className="text-[17px] sm:text-[21px] lg:text-[25px] text-gray-300 leading-relaxed mb-3">
                  Ez egy 2 személyes szabadulószoba — te vagy a webes játékos, és te fogsz segíteni a csapattársadnak, aki kiszabadul az iskolából.
                </p>
                <p className="text-[17px] sm:text-[21px] lg:text-[25px] text-gray-300 leading-relaxed">
                  Ha készen állsz és megvan a megfelelő kommunikációs eszközötök, nyomj a Start gombra!
                </p>
              </div>
              <button onClick={StartButton}
                className="text-[18px] sm:text-[22px] lg:text-[25px] h-12 sm:h-14 px-10 sm:px-16 bg-transparent hover:bg-green-600 text-green-400 hover:text-white font-semibold border border-green-600 hover:border-transparent rounded-xl transition-all duration-200">
                Start
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-300">
        <div className="bg-gray-950 text-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3">
            <h1 className="text-[16px] sm:text-[20px] lg:text-[25px] font-semibold text-center">Baranya Vármegyei Rabnóti</h1>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white opacity-50"></div>
        <div className="pt-5 sm:pt-7 pb-4 sm:pb-5">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex justify-center gap-4 sm:gap-6">
            <div className="flex flex-col items-start flex-shrink-0">
              <div className="w-[80px] h-[65px] sm:w-[110px] sm:h-[90px] border border-gray-200 shadow-sm overflow-hidden">
                <img src={heroImg} alt="Éjszaka a Rabnótiban logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[15px] sm:text-[18px] lg:text-[22px] font-bold text-white mb-1 sm:mb-2 leading-tight">
                Baranya Vármegyei SzC Radnóti Miklós Közgazdasági Technikum
              </h2>
              <p className="text-[13px] sm:text-[16px] lg:text-[18px] text-white">7633 Pécs, Esztergár L. utca 6.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 bg-gray-950">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center sm:justify-between gap-2">
            <p className="text-[12px] sm:text-[15px] lg:text-[20px] text-white text-center sm:text-left">2026 • Baranya Vármegyei SzC Radnóti Miklós Közgazdasági Technikum</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="text-[13px] sm:text-[15px] lg:text-[17px] text-white hover:text-blue-600">Adatkezelés</a>
              <a href="#" className="text-[13px] sm:text-[15px] lg:text-[17px] text-white hover:text-blue-600">Impresszum</a>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white opacity-50"></div>
      </footer>
    </div>
  )
}

export default App
