import { useEffect, useRef, useState } from 'react';
import { X, Upload, Trash2, Save, Music2, Plus, Volume2, Eye } from 'lucide-react';
import { WeddingCard } from '../types';

interface Props {
  cards: WeddingCard[];
  onSave: (cards: WeddingCard[]) => void;
  onClose: () => void;
}

const panel = 'rounded-xl border border-[#d4af37]/35 bg-[#2a0610] p-3';
const btn = 'rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold text-[#faedd0]';

function readCardImage(file: File, done: (src: string) => void, fail: (message: string) => void) {
  if (!file.type.startsWith('image/')) return fail('Please choose an image file.');
  const reader = new FileReader();
  reader.onerror = () => fail('Could not read this image. Please try another file.');
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => fail('This image could not be opened.');
    image.onload = () => {
      const max = 2400;
      const ratio = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);
      const context = canvas.getContext('2d');
      if (!context) return fail('Image processing is not available in this browser.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL('image/jpeg', 0.9));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

export default function WeddingEditorPanel({ cards, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<WeddingCard[]>(cards);
  const [volume, setVolume] = useState(18);
  const [tracks, setTracks] = useState<{ name: string; url: string }[]>([]);
  const [activeTrack, setActiveTrack] = useState('off');
  const [notice, setNotice] = useState('');
  const [previewCard, setPreviewCard] = useState<WeddingCard | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume, activeTrack]);
  useEffect(() => {
    const raw = localStorage.getItem('wa_music_volume');
    if (raw) setVolume(Number(raw));
    const savedTrack = localStorage.getItem('wa_music_track');
    if (savedTrack) setActiveTrack(savedTrack);
  }, []);

  const replaceCard = (index: number, file?: File) => {
    if (!file) return;
    readCardImage(file, src => {
      setDraft(prev => prev.map((card, i) => i === index ? { ...card, src, alt: file.name } : card));
      setNotice(`Card ${index + 1} image replaced in preview. Click Save Changes to keep it in this browser.`);
    }, setNotice);
  };

  const addCard = (file?: File) => {
    if (!file) return;
    readCardImage(file, src => setDraft(prev => [...prev, {
      id: Date.now(), title: file.name.replace(/\.[^.]+$/, ''), subtitle: 'Wedding Invitation',
      badge: 'Additional Card', src, alt: file.name,
    }]), setNotice);
  };

  const addTrack = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) return setNotice('Please upload an audio file (MP3, M4A, WAV).');
    if (tracks.length >= 5) return setNotice('You can add up to 5 music options in this panel.');
    const url = URL.createObjectURL(file);
    setTracks(prev => [...prev, { name: file.name, url }]);
    setActiveTrack(file.name);
  };

  const save = () => {
    onSave(draft);
    localStorage.setItem('wa_music_volume', String(volume));
    localStorage.setItem('wa_music_track', activeTrack);
    setNotice('Saved in this browser. Shared publishing for all guests needs cloud storage setup; this ZIP does not have that connected yet.');
  };

  return <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
    <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[#d4af37]/50 bg-[#1b030a] p-4 sm:p-6 text-[#faedd0]" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <div><h2 className="font-serif text-xl text-[#ffd700]">Wedding Editing Panel</h2><p className="text-xs text-[#e6ca85] mt-1">Replace the complete card artwork — no text editing</p></div>
        <button className={btn} onClick={onClose} aria-label="Close editor"><X size={16}/></button>
      </div>
      <div className="space-y-3">
        {draft.map((card, index) => <div className={panel} key={card.id}>
          <div className="flex gap-3 items-start">
            <img src={card.src} alt={card.alt} className="w-24 h-32 object-contain rounded bg-black/30 border border-[#d4af37]/20" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="text-sm font-semibold text-[#ffd700]">Card {index + 1}</div>
              <p className="text-[11px] text-[#e6ca85]">{card.title || card.badge || 'Invitation card'}</p>
              <div className="flex flex-wrap gap-2">
                <label className={btn + ' inline-flex items-center gap-1 cursor-pointer'}><Upload size={13}/> Replace full card<input type="file" accept="image/*" className="hidden" onChange={e => { replaceCard(index, e.target.files?.[0]); e.currentTarget.value = ''; }}/></label>
                <button className={btn + ' inline-flex items-center gap-1'} onClick={() => setPreviewCard(card)}><Eye size={13}/> Preview</button>
                <button className={btn + ' inline-flex items-center gap-1 text-rose-300'} onClick={() => setDraft(prev => prev.filter((_, i) => i !== index))}><Trash2 size={13}/> Remove</button>
              </div>
            </div>
          </div>
        </div>)}
      </div>
      <label className={btn + ' mt-3 inline-flex items-center gap-2 cursor-pointer'}><Plus size={14}/> Add another card<input type="file" accept="image/*" className="hidden" onChange={e => { addCard(e.target.files?.[0]); e.currentTarget.value = ''; }}/></label>
      <div className={panel + ' mt-4 space-y-3'}>
        <div className="flex items-center gap-2 text-[#ffd700] font-semibold"><Music2 size={16}/> Music & Volume</div>
        <div className="flex items-center gap-2"><Volume2 size={16}/><input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1"/><span className="text-xs w-10 text-right">{volume}%</span></div>
        <div className="text-[11px] text-[#e6ca85]">Upload up to 5 tracks to preview in this editor.</div>
        <div className="flex flex-wrap gap-2">{tracks.map(t => <button key={t.url} className={btn + (activeTrack === t.name ? ' border-[#ffd700] text-[#ffd700]' : '')} onClick={() => setActiveTrack(t.name)}>{t.name}</button>)}<button className={btn + (activeTrack === 'off' ? ' border-[#ffd700] text-[#ffd700]' : '')} onClick={() => setActiveTrack('off')}>OFF</button></div>
        <label className={btn + ' inline-flex items-center gap-2 cursor-pointer'}><Upload size={13}/> Upload music<input type="file" accept="audio/*" className="hidden" onChange={e => { addTrack(e.target.files?.[0]); e.currentTarget.value = ''; }}/></label>
        {tracks.filter(t => t.name === activeTrack).map(t => <audio ref={audioRef} key={t.url} src={t.url} controls autoPlay loop className="w-full"/>)}
        <p className="text-[10px] text-amber-200/80">Music uploads currently preview only in this browser; they are not published for guests yet.</p>
      </div>
      {notice && <p className="text-xs text-amber-200 mt-3">{notice}</p>}
      <div className="flex gap-2 mt-4"><button className="flex-1 rounded-lg bg-gradient-to-r from-[#8c122e] to-[#b32042] border border-[#d4af37]/60 px-4 py-3 text-sm font-bold text-[#ffd700] inline-flex justify-center items-center gap-2" onClick={save}><Save size={16}/> Save changes</button><button className={btn} onClick={onClose}>Close</button></div>
    </div>
    {previewCard && <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-3" onClick={() => setPreviewCard(null)}><button className="absolute top-4 right-4 rounded-full border border-[#d4af37] p-2 text-[#ffd700]" onClick={() => setPreviewCard(null)}><X/></button><img src={previewCard.src} alt={previewCard.alt} className="max-h-[88vh] max-w-full object-contain"/></div>}
  </div>;
}
