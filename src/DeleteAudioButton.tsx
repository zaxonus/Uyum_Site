import { useState, useRef, useEffect } from 'react';

type DeleteOption = 'first' | 'last' | 'all';

function DeleteAudioButton({ recordID, onDeleted,needChoice }: { recordID: string; onDeleted: () => void ;needChoice:boolean}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleChoice(option: DeleteOption) {
    setMenuOpen(false);

    const cloudFunctionMap: Record<DeleteOption, string> = {
      first: 'deleteFirstAudioFile',
      last: 'deleteLastAudioFile',
      all: 'deleteAllAudioFiles',
    };

    try {
      await Parse.Cloud.run(cloudFunctionMap[option],{recordID});
      onDeleted();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  function handleButtonClick() {
    if (needChoice) {
      setMenuOpen(true);
    } else {
      handleChoice('first');
    }
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button onClick={handleButtonClick/*() => setMenuOpen((open) => !open)*/}>
        {/* <i className="fa-solid fa-trash fa-2x text-stone-800" /> */}
        <i className="fa-solid fa-trash-arrow-up fa-2x text-stone-800" />
      </button>

      {menuOpen && (
        <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg border border-stone-200">
        {/* <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg border-2 border-red-500"> */}
          <button
            onClick={() => handleChoice('first')}
            className="block w-full text-left px-4 py-2 hover:bg-stone-100"
          >
            Delete first
          </button>
          <button
            onClick={() => handleChoice('last')}
            className="block w-full text-left px-4 py-2 hover:bg-stone-100"
          >
            Delete last
          </button>
          <button
            onClick={() => handleChoice('all')}
            className="block w-full text-left px-4 py-2 hover:bg-stone-100"
          >
            Delete all
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteAudioButton;